const express = require('express');
const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.route('/')
  .get((req, res, next) => {
    Dishes.find({})
      .populate('comments.author')
      .then((dishes) => res.status(200).json(dishes))
      .catch(next);
  })
  .post((req, res, next) => {
    Dishes.create(req.body)
      .then((dish) => res.status(201).json(dish))
      .catch(next);
  })
  .put((req, res) => {
    res.status(403).send('PUT operation not supported on /dishes');
  })
  .delete((req, res, next) => {
    Dishes.deleteMany({})
      .then((response) => res.status(200).json(response))
      .catch(next);
  });

dishRouter.route('/:dishId')
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .populate('comments.author')
      .then((dish) => {
        if (dish) return res.status(200).json(dish);
        const err = new Error(`Dish ${req.params.dishId} not found`);
        err.status = 404;
        return next(err);
      })
      .catch(next);
  })
  .post((req, res) => {
    res.status(403).send(`POST operation not supported on /dishes/${req.params.dishId}`);
  })
  .put((req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, { $set: req.body }, { new: true })
      .then((dish) => {
        if (dish) return res.status(200).json(dish);
        const err = new Error(`Dish ${req.params.dishId} not found`);
        err.status = 404;
        return next(err);
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    Dishes.findByIdAndDelete(req.params.dishId)
      .then((response) => {
        if (response) return res.status(200).json(response);
        const err = new Error(`Dish ${req.params.dishId} not found`);
        err.status = 404;
        return next(err);
      })
      .catch(next);
  });

dishRouter.route('/:dishId/comments')
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .populate('comments.author')
      .then((dish) => {
        if (dish) return res.status(200).json(dish.comments);
        const err = new Error(`Dish ${req.params.dishId} not found`);
        err.status = 404;
        return next(err);
      })
      .catch(next);
  })
  .post((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (!dish) {
          const err = new Error(`Dish ${req.params.dishId} not found`);
          err.status = 404;
          return next(err);
        }
        dish.comments.push(req.body);
        return dish.save()
          .then((savedDish) => Dishes.findById(savedDish._id).populate('comments.author'))
          .then((populatedDish) => res.status(201).json(populatedDish));
      })
      .catch(next);
  })
  .put((req, res) => {
    res.status(403).send(`PUT operation not supported on /dishes/${req.params.dishId}/comments`);
  })
  .delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (!dish) {
          const err = new Error(`Dish ${req.params.dishId} not found`);
          err.status = 404;
          return next(err);
        }
        dish.comments = [];
        return dish.save().then((savedDish) => res.status(200).json(savedDish));
      })
      .catch(next);
  });

module.exports = dishRouter;
