const express = require('express');

const router = express.Router();

const {db, Mask} = require('./db');

const mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
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