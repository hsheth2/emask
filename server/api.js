const express = require('express');
const config = require('./config');

const router = express.Router();

const {Mask} = require('./db');
const {sync: mailgunSync} = require('./mailgun');

router.get('/ping', (req, res) => {
    res.json({
        message: 'pong',
    })
});

router.get('/sync', (req, res, next) => {
    mailgunSync((err) => {
        if (err)
            return next(err);

        res.json({
            message: 'synced with backend',
        })
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
    mask.validate((err) => {
        if (err)
            return res.status(400).json({
                message: err.message,
            });

        mask.save((err, mask) => {
            if (err)
                return next(err);

            mailgunSync((err) => {
                if (err)
                    return next(err);

                res.status(201).json({
                    message: "Mask created",
                    mask: mask,
                })
            });
        })
    })
});

router.patch('/masks/:id', (req, res, next) => {
    const maskId = req.params.id;
    const update = req.body;

    Mask.findOneAndUpdate({_id: maskId, user: req.user}, update, (err) => {
        if (err)
            return next(err);

        mailgunSync((err) => {
            if (err)
                return next(err);
            res.status(202).json({
                message: "Mask updated",
            })
        });
    })
});

// TODO delete method

module.exports = router;