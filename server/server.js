// backend server

require('dotenv').config();

const mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
});

mailgun.get('/routes', {limit: 100}).then((data) => {
    console.log(data);
});

