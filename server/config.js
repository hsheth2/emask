require('dotenv').config();

module.exports = {
    sessionSecret: 'SOMETHING BIG GOES HERE',
    mongodb: {
        host: process.env.MONGODB_URI,
    },
    mailgun: {
        routePriority: parseInt(process.env.MAILGUN_ROUTE_PRIORITY),
        apiKey: process.env.MAILGUN_API_KEY,
    },
    domain: process.env.MAILGUN_DOMAIN,
};
