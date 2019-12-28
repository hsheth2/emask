const config = require('./config');
const express = require('express');
const {Mask} = require('./db');
const MailComposer = require('nodemailer/lib/mail-composer');

const mailgun = require('mailgun-js')({
    apiKey: config.mailgun.apiKey,
    domain: config.sendDomain,
});

const router = express.Router();

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function mailgunMaskIdFromDesc(description) {
    const pattern = new RegExp(/^EMask; mask_id=(.+); [\S\s]*$/);

    const match = description.match(pattern);
    if (!match)
        return null;

    return match[1];
}

function mailgunRouteFromMask(mask) {
    const address = escapeRegExp(mask.address);
    const domain = escapeRegExp(config.domain);
    return {
        priority: config.mailgun.routePriority,
        description: `EMask; mask_id=${mask._id}; ${mask.description}`,
        expression: `match_recipient("${address}@${domain}")`,
        action: [
            //`forward("${mask.user.email}")`,
            //`forward("https://${config.callbackDomain}/callback/mailgun/message_received/${mask.user._id}")`,
            `store(notify="https://${config.callbackDomain}/callback/mailgun/message_received/${mask.user._id}")`,
            'store()',
            'stop()',
        ],
    }
}

function mailgunGenerateTargetRoutes(masks) {
    const domain = escapeRegExp(config.domain);
    const targetRoutes = {
        'catchall': {
            priority: config.mailgun.routePriority + 1,
            description: `EMask; mask_id=catchall; a catchall route for ${config.domain}`,
            expression: `match_recipient(".*@${domain}")`,
            action: [
                // TODO: Forward to an admin email or something more intelligent.
                'store()',
                'stop()',
            ],
        }
    };
    for (const mask of masks) {
        const maskId = mask._id;
        targetRoutes[maskId] = mailgunRouteFromMask(mask);
    }
    return targetRoutes;
}

async function mailgunUpdateServer(masks, routes) {
    const targetRoutes = mailgunGenerateTargetRoutes(masks);

    // First pass: add/update routes for all masks
    for (const maskId in targetRoutes) {
        const goalRoute = targetRoutes[maskId];

        // noinspection EqualityComparisonWithCoercionJS
        const prevRoute = routes.find(route => route.maskId == maskId);
        if (prevRoute) {
            // Only send request to server if necessary
            const updatedRoute = {};
            Object.keys(goalRoute).forEach((key) => {
                // The mailgun API requires this parameter be sent as "action", but in its replies
                // it uses the "actions" key.
                let prevKey = key;
                if (prevKey === "action")
                    prevKey = "actions";

                if (JSON.stringify(prevRoute[prevKey]) !== JSON.stringify(goalRoute[key])) {
                    updatedRoute[key] = goalRoute[key];
                }
            });

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
    for (const route of routes) {
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

            const routes = response.items.filter((route) => {
                const maskId = mailgunMaskIdFromDesc(route.description);
                if (maskId) {
                    route.maskId = maskId;
                    return true;
                }
                return false;
            });

            // console.log("data", masks);
            // console.log("routes", routes);

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

router.post('/*', config.upload.any(), (req, res, next) => {
    const body = req.body;
    //console.log("mailgun validation", req);
    if (!mailgun.validateWebhook(body.timestamp, body.token, body.signature)) {
        res.status(400).json({
            'error': 'Callback message validation failed',
        })
    } else next();
});

router.post('/message_received/:maskId', (req, res) => {
    const mask_id = req.params.maskId;
    console.log('callback message recv handler');
    console.log(req.body);

    const messageOptions = {
        from: req.body['From'],
        to: req.body['To'],
        // TODO: cc and bcc fields
        subject: req.body.subject,
        text: req.body['body-plain'],
        html: req.body['body-html'],
        // TODO: attachments
        // TODO: MIME headers
        // TODO: pass through Message-ID
        // TODO: pass through In-Reply-To
        // TODO: set replyTo email address

        disableFileAccess: true,
        disableUrlAccess: true,
    };

    new MailComposer(messageOptions).compile().build((err, message) => {
        if (err) throw err;

        mailgun.messages().sendMime({
            to: "hsheth2@gmail.com", // TODO look up actual person on end of mask
            message: message.toString('ascii'),
        }, (err, body) => {
            if (err) throw err;

            res.json({
                message: 'yay',
            })
        })

    });
});

module.exports = {
    sync: mailgunSync,
    callbackRouter: router,
};
