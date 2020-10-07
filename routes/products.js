const express = require('express');
const router = express.Router();
const validator = require('../validation/product');
const idValidator = require('../validation/id');
const controller = require('../controllers/products.controller');
const token = require('../validation/verifyToken');

// /api/v1/products
router.post(
  '/',
  token.verifyToken,
  token.checkIfIsAdmin,
  validator.newProduct,
  controller.createProduct
);

router.get('/', controller.getProducts);

// /api/v1/products/:productId
router.get('/:id', idValidator, controller.getOneProduct);

router.patch(
  '/:id',
  token.verifyToken,
  token.checkIfIsAdmin,
  validator.updateProduct,
  controller.updateProduct
);

router.delete(
  '/:id',
  token.verifyToken,
  token.checkIfIsAdmin,
  idValidator,
  controller.deleteProduct
);

module.exports = router;
