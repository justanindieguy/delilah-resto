const express = require('express');
const router = express.Router();
const controller = require('../controllers/deliveries.controller');
const validator = require('../validation/delivery');
const idValidator = require('../validation/id');
const token = require('../validation/verifyToken');

// /api/v1/deliveries
router.get(
  '/allDeliveries',
  token.verifyToken,
  token.checkIfIsAdmin,
  controller.getAllDeliveries
);

router.get('/myDeliveries', token.verifyToken, controller.getUserDeliveries);

router.post(
  '/',
  token.verifyToken,
  validator.createDelivery,
  controller.createDelivery
);

// /api/v1/deliveries/:deliveryId
router.get('/:id', idValidator, token.verifyToken, controller.getOneDelivery);

router.patch(
  '/:id',
  idValidator,
  token.verifyToken,
  token.checkIfIsAdmin,
  validator.updateDelivery,
  controller.updateDelivery
);

module.exports = router;
