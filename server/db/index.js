const mongoose = require('mongoose');
const config = require('../config');

// https://stackoverflow.com/a/51962721
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(config.mongodb.host);
const db = mongoose.connection;
db.on('error', (err) => {
    console.error('database connection error:', err);
    throw err;
});
db.once('open', () => {
    console.log('connected to database');
});

module.exports.db = db;
module.exports.Mask = require('./mask');
module.exports.User = require('./user');
