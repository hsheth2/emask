// backend server

require('dotenv').config();

const express = require('express');
const app = express();
const port = 3001;

// https://stackoverflow.com/a/12008719
const bodyParser = require('body-parser');
app.use(bodyParser.json());  // to support JSON-encoded bodies

const session = require('express-session');
// TODO set up express-session properly
app.use(session({secret: "TODO"}));

const api = require('./api');
// TODO only allow routing to API if logged in
app.use('/api', api);

const auth = require('./auth')(app);
app.use('/auth', auth);

app.listen(port, () => console.log(`Server listening on port ${port}!`));
