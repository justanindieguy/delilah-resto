const { ONLY_INT_MSG } = require('../utils/messages');
const { param, body } = require('express-validator');

const addToFavorites = [
  body('producto_id')
    .isInt()
    .withMessage(ONLY_INT_MSG)
    .not()
    .isEmpty()
    .withMessage('El ID del producto es obligatorio.'),
];

const removeFromFavorites = [param('productId', ONLY_INT_MSG).isInt()];

module.exports = { addToFavorites, removeFromFavorites };
