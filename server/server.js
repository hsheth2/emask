// backend server

const config = require('./config');

const express = require('express');
const app = express();

const morgan = require('morgan');
app.use(morgan('tiny'));

// https://stackoverflow.com/a/12008719
const bodyParser = require('body-parser');
app.use(bodyParser.json());  // to support JSON-encoded bodies

const session = require('express-session');
const db = require('./db');
const MongoStore = require('connect-mongo')(session);
app.use(session({
    secret: config.sessionSecret,
    store: new MongoStore({
        mongooseConnection: db.connection,
    }),
    saveUninitialized: true,
    resave: true,
}));

const auth = require('./auth');
auth.setup(app);
app.use('/auth', auth.router);

const api = require('./api');
app.use('/api', auth.authenticate, api);

const callback = require('./callback');
app.use('/callback', callback.router);

const port = config.port;
app.listen(port, () => console.log(`Server listening on port ${port}!`));
