const { ONLY_INT_MSG, ONLY_FLOAT_MSG } = require('../utils/messages');
const express = require('express');
const router = express.Router();
const { param, body } = require('express-validator');
const controller = require('../controllers/products.controller');

// /api/v1/products
router.post(
  '/',
  [
    body('nombre', 'El nombre es obligatorio.').not().isEmpty(),
    body('precio')
      .isFloat()
      .withMessage(ONLY_FLOAT_MSG)
      .not()
      .isEmpty()
      .withMessage('El precio es obligatorio.'),
  ],
  controller.createProduct
);

router.get('/', controller.getProducts);

// /api/v1/products/:productId
router.get(
  '/:id',
  [param('id', ONLY_INT_MSG).isInt()],
  controller.getOneProduct
);

router.patch(
  '/:id',
  [
    param('id', ONLY_INT_MSG).isInt(),
    body('precio', ONLY_FLOAT_MSG).isFloat().optional(),
  ],
  controller.updateProduct
);

router.delete(
  '/:id',
  [param('id', ONLY_INT_MSG).isInt()],
  controller.deleteProduct
);

module.exports = router;
