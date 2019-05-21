const express = require('express');
const config = require('./config');

const router = express.Router();

const {Mask} = require('./db');

router.get('/ping', (req, res) => {
    res.json({
        message: 'pong',
    })
});

const mailgun = require('mailgun-js')({
    apiKey: config.mailgun.apiKey,
    domain: config.domain,
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

function mailgunRouteFromMask(mask) {
    let address = escapeRegExp(mask.address);
    let domain = escapeRegExp(config.domain);
    return {
        priority: config.mailgun.routePriority,
        description: `EMask; mask_id=${mask._id}; ${mask.description}`,
        expression: `match_recipient("${address}@${domain}")`,
        action: [
            `forward("${mask.user.email}")`,
            'stop()',
        ],
    }
}

async function mailgunUpdateServer(masks, routes) {
    // First pass: add/update routes for all masks
    for (let mask of masks) {
        let maskId = mask._id;

        let goalRoute = mailgunRouteFromMask(mask);
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

function mailgunSync(done) {
    Mask.find({blocked: false}).populate('user').exec((err, masks) => {
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

            mailgunUpdateServer(masks, routes)
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
    mailgunSync((err) => {
        if (err)
            return next(err);

        res.send('refreshed');
    });
});

router.get('/masks', (req, res, next) => {
    Mask.find({user: req.user}, (err, data) => {
        if (err) return next(err);
        res.json({
            masks: data,
            domain: config.domain,
        });
    })
});

router.post('/masks', (req, res, next) => {
    const data = req.body;
    data.user = req.user;

    if (!data.address) {
        data.address = Math.random().toString(36).substring(2,11)
    }

    const mask = new Mask(data);
    mask.save((err, mask) => {
        // TODO run validate first
        if (err)
            return next(err);

        mailgunSync((err) => {
            if (err)
                return next(err);
            res.sendStatus(201);
        });
    })
});

module.exports = router;