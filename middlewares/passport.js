/* eslint-disable no-console */
const passportJWT = require('passport-jwt');
const User = require('../database/models/users');

const JWTStrategy = passportJWT.Strategy;
const { ExtractJwt } = passportJWT;
const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRETKEY;

const passportConfig = (passport) => {
  passport.use(
    new JWTStrategy(opts, (jwtPayload, done) => {
      User.findById(jwtPayload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    }),
  );
};

module.exports = passportConfig;
