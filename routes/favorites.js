const express = require('express');
const router = express.Router();
const controller = require('../controllers/favorites.controller');
const validator = require('../validation/favorite');
const token = require('../validation/verifyToken');

router.get('/', token.verifyToken, controller.getFavorites);

router.post(
  '/',
  validator.addToFavorites,
  token.verifyToken,
  controller.addFavorite
);

router.delete(
  '/:productId',
  validator.removeFromFavorites,
  token.verifyToken,
  controller.removeFavorite
);

module.exports = router;
