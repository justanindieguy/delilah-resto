const express = require('express');
const router = express.Router();
const controller = require('../controllers/shippings.controller');

// /api/v1/shippings
router.get('/', controller.getShippings);
router.post('/', controller.createShipping);

module.exports = router;
