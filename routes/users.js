const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const authenticate = require('../authenticate');

const router = express.Router();

router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).json(users))
    .catch(next);
});

router.post('/signup', (req, res, next) => {
  User.register(new User({ username: req.body.username }), req.body.password)
    .then((user) => {
      if (req.body.firstname) user.firstname = req.body.firstname;
      if (req.body.lastname) user.lastname = req.body.lastname;
      return user.save();
    })
    .then((user) => {
      passport.authenticate('local')(req, res, () => {
        res.status(200).json({
          success: true,
          status: 'Registration Successful!',
          user
        });
      });
    })
    .catch(next);
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  const token = authenticate.getToken({ _id: req.user._id });
  res.status(200).json({
    success: true,
    token,
    status: 'You are successfully logged in!'
  });
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    const err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
