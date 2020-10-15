const { ONLY_INT_MSG } = require('../utils/messages');
const { body } = require('express-validator');

const reqBody = [
  body('producto_id')
    .isInt()
    .withMessage(ONLY_INT_MSG)
    .not()
    .isEmpty()
    .withMessage('El ID del producto es obligatorio.'),
];

module.exports = { reqBody };
