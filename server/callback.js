const config = require('./config');
const express = require('express');

const router = express.Router();

const {callbackRouter: mailgunRouter} = require('./mailgun');
router.use('/mailgun', mailgunRouter);

module.exports = {
    router: router,
};
