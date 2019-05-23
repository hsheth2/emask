require('dotenv').config();

module.exports = {
    port: 3001,
    sessionSecret: 'SOMETHING BIG GOES HERE',
    mongodb: {
        host: process.env.MONGODB_URI,
    },
    mailgun: {
        routePriority: parseInt(process.env.MAILGUN_ROUTE_PRIORITY),
        apiKey: process.env.MAILGUN_API_KEY,
    },
    domain: process.env.MAILGUN_DOMAIN, // TODO need to actually set up masks.sheth.io
};
