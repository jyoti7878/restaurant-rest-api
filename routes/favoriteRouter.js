const express = require('express');
const Favorites = require('../models/favorite');
const authenticate = require('../authenticate');

const favoriteRouter = express.Router();

favoriteRouter.use(authenticate.verifyUser);

favoriteRouter.route('/')
  .get((req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .populate('user')
      .populate('dishes')
      .then((favorites) => {
        if (!favorites) return res.status(200).json({ user: req.user._id, dishes: [] });
        return res.status(200).json(favorites);
      })
      .catch(next);
  })
  .post((req, res, next) => {
    const dishes = Array.isArray(req.body) ? req.body : [];

    Favorites.findOne({ user: req.user._id })
      .then((favorites) => {
        if (!favorites) {
          return Favorites.create({
            user: req.user._id,
            dishes: extractDishIds(dishes)
          });
        }

        extractDishIds(dishes).forEach((dishId) => {
          if (!favorites.dishes.some((id) => id.equals(dishId))) {
            favorites.dishes.push(dishId);
          }
        });
        return favorites.save();
      })
      .then((favorites) => Favorites.findById(favorites._id).populate('user').populate('dishes'))
      .then((favorites) => res.status(200).json(favorites))
      .catch(next);
  })
  .put((req, res) => {
    res.status(403).send('PUT operation not supported on /favorites');
  })
  .delete((req, res, next) => {
    Favorites.findOneAndDelete({ user: req.user._id })
      .then((response) => res.status(200).json(response || { message: 'No favorites found for this user' }))
      .catch(next);
  });

favoriteRouter.route('/:dishId')
  .get((req, res) => {
    res.status(403).send(`GET operation not supported on /favorites/${req.params.dishId}`);
  })
  .post((req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then((favorites) => {
        if (!favorites) {
          return Favorites.create({
            user: req.user._id,
            dishes: [req.params.dishId]
          });
        }

        if (!favorites.dishes.some((id) => id.equals(req.params.dishId))) {
          favorites.dishes.push(req.params.dishId);
        }
        return favorites.save();
      })
      .then((favorites) => Favorites.findById(favorites._id).populate('user').populate('dishes'))
      .then((favorites) => res.status(200).json(favorites))
      .catch(next);
  })
  .put((req, res) => {
    res.status(403).send(`PUT operation not supported on /favorites/${req.params.dishId}`);
  })
  .delete((req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then((favorites) => {
        if (!favorites) return res.status(200).json({ message: 'No favorites found for this user' });

        favorites.dishes = favorites.dishes.filter((dishId) => !dishId.equals(req.params.dishId));
        return favorites.save();
      })
      .then((favorites) => Favorites.findById(favorites._id).populate('user').populate('dishes'))
      .then((favorites) => res.status(200).json(favorites))
      .catch(next);
  });

function extractDishIds(items) {
  return items
    .map((item) => item && (item._id || item))
    .filter(Boolean);
}

module.exports = favoriteRouter;
