const express = require('express');

const router = express.Router();

const {Mask} = require('./db');

router.get('/ping', (req, res) => {
    res.json({
        message: 'pong',
    })
});

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
        priority: parseInt(process.env.MAILGUN_ROUTE_PRIORITY),
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
    // First pass: add/update routes for all masks
    for (let mask of masks) {
        let maskId = mask._id;

        let goalRoute = mailgunRouteFromMask(user, mask);
        // noinspection EqualityComparisonWithCoercionJS
        let prevRoute = routes.find(route => route.maskId == maskId);
        if (prevRoute) {
            // Only send request to server if necessary
            let updatedRoute = {};
            for (let key in goalRoute) {
                // The mailgun API requires this parameter be sent as "action", but in its replies
                // it uses the "actions" key.
                let prevKey = key;
                if (prevKey === "action")
                    prevKey = "actions";

                if (JSON.stringify(prevRoute[prevKey]) !== JSON.stringify(goalRoute[key])) {
                    updatedRoute[key] = goalRoute[key];
                }
            }

            if (Object.keys(updatedRoute).length !== 0) {
                console.log(`updating mailgun route id=${prevRoute.id}`, updatedRoute);
                await mailgun.put(`/routes/${prevRoute.id}`, updatedRoute);
            }
            prevRoute.processed = true;
        } else {
            console.log("creating mailgun route", goalRoute);
            await mailgun.post('/routes', goalRoute);
        }
    }

    // Second pass: remove extra routes
    for (let route of routes) {
        if (!route.processed) {
            console.log("deleting mailgun route", route);
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

router.get('/masks', (req, res, next) => {
    Mask.find({userId: 1}, (err, data) => { // TODO use actual user ID
        if (err) return next(err);
        res.json({
            masks: data,
            domain: process.env.MAILGUN_DOMAIN,
        });
    })
});

router.post('/masks', (req, res, next) => {
    const data = req.body;
    data.userId = 1; // TODO user actual user ID
    if (!data.address) {
        data.address = Math.random().toString(36).substring(2,11)
    }
    data.address = data.address + '';

    if (data.address.search('@') >= 0)
        return res.status(400).send('Address cannot contain "@" character');

    const mask = new Mask(data);
    mask.save((err, mask) => {
        if (err) return next(err);

        // TODO sync to mailgun
        res.sendStatus(201);
    })
});

module.exports = router;