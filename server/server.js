// backend server

const config = require('./config');

const express = require('express');
const app = express();
const port = 3001;

const morgan = require('morgan');
app.use(morgan('tiny'));

// https://stackoverflow.com/a/12008719
const bodyParser = require('body-parser');
app.use(bodyParser.json());  // to support JSON-encoded bodies

const session = require('express-session');
// TODO set up express-session properly
app.use(session({
    secret: config.sessionSecret,
}));

const auth = require('./auth');
auth.setup(app);
app.use('/auth', auth.router);

const api = require('./api');
app.use('/api', auth.authenticate, api);

app.listen(port, () => console.log(`Server listening on port ${port}!`));
