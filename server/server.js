// backend server

require('dotenv').config();

const express = require('express');
const app = express();
const port = 3001;

// https://stackoverflow.com/a/12008719
const bodyParser = require('body-parser');
app.use(bodyParser.json());  // to support JSON-encoded bodies

const api = require('./api');
app.use('/api', api);

app.listen(port, () => console.log(`Server listening on port ${port}!`));
