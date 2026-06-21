const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const User = require('./models/user');
const config = require('./config/config');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function getToken(user) {
  return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
  User.findById(jwtPayload._id)
    .then((user) => {
      if (user) return done(null, user);
      return done(null, false);
    })
    .catch((err) => done(err, false));
}));

exports.verifyUser = passport.authenticate('jwt', { session: false });

exports.verifyAdmin = function verifyAdmin(req, res, next) {
  if (req.user && req.user.admin) {
    return next();
  }
  const err = new Error('You are not authorized to perform this operation!');
  err.status = 403;
  return next(err);
};
