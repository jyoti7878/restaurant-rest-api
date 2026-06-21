const express = require('express');
const Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.route('/')
  .get((req, res, next) => {
    Promotions.find({})
      .then((promotions) => res.status(200).json(promotions))
      .catch(next);
  })
  .post((req, res, next) => {
    Promotions.create(req.body)
      .then((promotion) => res.status(201).json(promotion))
      .catch(next);
  })
  .put((req, res) => {
    res.status(403).send('PUT operation not supported on /promotions');
  })
  .delete((req, res, next) => {
    Promotions.deleteMany({})
      .then((response) => res.status(200).json(response))
      .catch(next);
  });

promoRouter.route('/:promoId')
  .get((req, res, next) => {
    Promotions.findById(req.params.promoId)
      .then((promotion) => {
        if (promotion) return res.status(200).json(promotion);
        const err = new Error(`Promotion ${req.params.promoId} not found`);
        err.status = 404;
        return next(err);
      })
      .catch(next);
  })
  .post((req, res) => {
    res.status(403).send(`POST operation not supported on /promotions/${req.params.promoId}`);
  })
  .put((req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, { $set: req.body }, { new: true })
      .then((promotion) => {
        if (promotion) return res.status(200).json(promotion);
        const err = new Error(`Promotion ${req.params.promoId} not found`);
        err.status = 404;
        return next(err);
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    Promotions.findByIdAndDelete(req.params.promoId)
      .then((response) => {
        if (response) return res.status(200).json(response);
        const err = new Error(`Promotion ${req.params.promoId} not found`);
        err.status = 404;
        return next(err);
      })
      .catch(next);
  });

module.exports = promoRouter;
