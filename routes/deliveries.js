const express = require('express');
const router = express.Router();
const controller = require('../controllers/deliveries.controller');
const deliveryValidator = require('../validation/delivery');

// /api/v1/deliveries
router.get('/', controller.getDeliveries);
router.post('/', deliveryValidator, controller.createDelivery);

module.exports = router;
