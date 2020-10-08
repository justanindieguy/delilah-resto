const { ONLY_INT_MSG, ONLY_FLOAT_MSG } = require('../utils/messages');
const { param, body } = require('express-validator');

const newProduct = [
  body('nombre', 'El nombre es obligatorio.').not().isEmpty(),
  body('precio')
    .isFloat()
    .withMessage(ONLY_FLOAT_MSG)
    .not()
    .isEmpty()
    .withMessage('El precio es obligatorio.'),
];

const updateProduct = [body('precio', ONLY_FLOAT_MSG).isFloat().optional()];

module.exports = { newProduct, updateProduct };
