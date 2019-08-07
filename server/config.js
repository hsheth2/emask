const dotenv = require('dotenv').config();
if (dotenv.error)
    throw dotenv.error;

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
});

module.exports = {
    port: parseInt(process.env.PORT, 10) || 3001,
    sessionSecret: 'SOMETHING BIG GOES HERE',
    mongodb: {
        host: process.env.MONGODB_URI,
    },
    mailgun: {
        routePriority: parseInt(process.env.MAILGUN_ROUTE_PRIORITY, 10),
        apiKey: process.env.MAILGUN_API_KEY,
    },
    domain: process.env.MAILGUN_DOMAIN,
    sendDomain: process.env.MAILGUN_SEND_DOMAIN || process.env.MAILGUN_DOMAIN,
    callbackDomain: process.env.MAILGUN_CALLBACK_DOMAIN || process.env.MAILGUN_DOMAIN,
    upload: upload,
};
