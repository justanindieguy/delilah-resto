const { ONLY_INT_MSG } = require('../utils/messages');
const { body } = require('express-validator');

const reqBody = [
  body('productoId')
    .isInt()
    .withMessage(ONLY_INT_MSG)
    .not()
    .isEmpty()
    .withMessage('El ID del producto es obligatorio.'),
];

module.exports = { reqBody };
