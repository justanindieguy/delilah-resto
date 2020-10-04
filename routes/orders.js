const express = require('express');
const router = express.Router();
const controller = require('../controllers/orders.controller');

router.get('/', controller.getOrders);

module.exports = router;
