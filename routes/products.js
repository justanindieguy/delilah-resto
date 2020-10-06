const express = require('express');
const router = express.Router();
const validator = require('../validation/product');
const idValidator = require('../validation/id');
const controller = require('../controllers/products.controller');

// /api/v1/products
router.get('/', controller.getProducts);
router.post('/', validator.newProduct, controller.createProduct);

// /api/v1/products/:productId
router.get('/:id', idValidator, controller.getOneProduct);
router.patch('/:id', validator.updateProduct, controller.updateProduct);
router.delete('/:id', idValidator, controller.deleteProduct);

module.exports = router;
