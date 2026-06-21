const express = require('express');
const Leaders = require('../models/leaders');

const leaderRouter = express.Router();

leaderRouter.route('/')
  .get((req, res, next) => {
    Leaders.find({})
      .then((leaders) => res.status(200).json(leaders))
      .catch(next);
  })
  .post((req, res, next) => {
    Leaders.create(req.body)
      .then((leader) => res.status(201).json(leader))
      .catch(next);
  })
  .put((req, res) => {
    res.status(403).send('PUT operation not supported on /leaders');
  })
  .delete((req, res, next) => {
    Leaders.deleteMany({})
      .then((response) => res.status(200).json(response))
      .catch(next);
  });

leaderRouter.route('/:leaderId')
  .get((req, res, next) => {
    Leaders.findById(req.params.leaderId)
      .then((leader) => {
        if (leader) return res.status(200).json(leader);
        const err = new Error(`Leader ${req.params.leaderId} not found`);
        err.status = 404;
        return next(err);
      })
      .catch(next);
  })
  .post((req, res) => {
    res.status(403).send(`POST operation not supported on /leaders/${req.params.leaderId}`);
  })
  .put((req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, { $set: req.body }, { new: true })
      .then((leader) => {
        if (leader) return res.status(200).json(leader);
        const err = new Error(`Leader ${req.params.leaderId} not found`);
        err.status = 404;
        return next(err);
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    Leaders.findByIdAndDelete(req.params.leaderId)
      .then((response) => {
        if (response) return res.status(200).json(response);
        const err = new Error(`Leader ${req.params.leaderId} not found`);
        err.status = 404;
        return next(err);
      })
      .catch(next);
  });

module.exports = leaderRouter;
