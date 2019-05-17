const express = require('express');

const router = express.Router();

const {db, Mask} = require('./db');

const mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
});

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function mailgunMaskIdFromDesc(description) {
    let pattern = new RegExp(/^EMask; mask_id=(.+); [\S\s]*$/);

    let match = description.match(pattern);
    if (!match)
        return null;

    return match[1];
}

function mailgunRouteFromMask(user, mask) {
    let address = escapeRegExp(mask.address);
    let domain = escapeRegExp(process.env.MAILGUN_DOMAIN);
    return {
        priority: process.env.MAILGUN_ROUTE_PRIORITY,
        description: `EMask; mask_id=${mask._id}; ${mask.description}`,
        expression: `match_recipient("${address}@${domain}")`,
        action: [
            // TODO forward based on user id
            'forward("hsheth2@gmail.com")',
            'stop()',
        ],
    }
}

async function mailgunUpdateServer(user, masks, routes) {
    // first pass: add/update routes for all masks
    for (let mask of masks) {
        let maskId = mask._id;

        let goalRoute = mailgunRouteFromMask(user, mask);
        let prevRoute = routes.find(route => route.maskId === maskId);
        if (prevRoute) {
            // TODO only put server if necessary
            await mailgun.put(`/routes/${prevRoute.id}`, goalRoute);
            prevRoute.processed = true;
        } else {
            await mailgun.post('/routes', goalRoute);
        }
    }

    // second pass: remove extra routes
    for (let route of routes) {
        if (!route.processed) {
            await mailgun.delete(`/routes/${route.id}`);
        }
    }
}

function mailgunSync(userId, done) {
    Mask.find({userId: userId}, (err, masks) => {
        if (err)
            return done(err);

        mailgun.get('/routes', {limit: 1000}, (err, response) => {
            // TODO should implement proper pagination rather than a hardcoded limit
            if (err)
                return done(err);

            let routes = response.items.filter((route) => {
                let maskId = mailgunMaskIdFromDesc(route.description);
                if (maskId) {
                    route.maskId = maskId;
                    return true;
                }
                return false;
            });

            console.log("data", masks);
            console.log("routes", routes);

            mailgunUpdateServer(null, masks, routes)
                .then(() => {
                    done(null);
                })
                .catch((err) => {
                    done(err);
                });
        })
    });
}

router.get('/sync', (req, res, next) => {
    mailgunSync(1, (err) => {
        if (err)
            return next(err);

        res.send('refreshed');
    });
});

router.get('/ping', (req, res) => res.send('pong'));

router.get('/masks', (req, res, next) => {
    Mask.find({userId: 1}, (err, data) => { // TODO use actual user ID
        if (err) return next(err);
        res.json(data);
    })
});

router.post('/masks', (req, res, next) => {
    const data = req.body;
    data.userId = 1; // TODO user actual user ID
    if (!data.address) {
        data.address = "RANDOMID"  // TODO generate real random masked address
    }

    const mask = new Mask(data);
    mask.save((err, mask) => {
        if (err) return next(err);
        res.sendStatus(202);
    })
});

module.exports = router;