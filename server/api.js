const express = require('express');

const router = express.Router();

const {db, Mask} = require('./db');

const mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
});

router.get('/ping', (req, res) => res.send('pong'));

router.get('/masks', (req, res, next) => {
    Mask.find({userId: 1}, (err, data) => {
        if (err) return next(err);
        res.json(data);
    })
});

module.exports = router;