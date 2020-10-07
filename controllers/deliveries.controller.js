const { validationResult } = require('express-validator');

function createDelivery(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  res.send("You're about to create a new shipping.");
}

function getDeliveries(req, res) {
  res.send('Getting all the orders.');
}

module.exports = { createDelivery, getDeliveries };
