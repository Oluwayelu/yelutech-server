/* eslint-disable no-console */
const express = require('express')
const passport = require('passport')
const logger = require('morgan');
require('dotenv/config');

const routes = require('./routes');
const passportConfig = require('./middlewares/passport');
require('./database');

const app = express();
const port = process.env.PORT || 5000;

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

app.use(passport.initialize());

passportConfig(passport);

app.use('/api/v1', routes);

app.use('/api/v1/uploads/blog', express.static('uploads/blog'))

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
