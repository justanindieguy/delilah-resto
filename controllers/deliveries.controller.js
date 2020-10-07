const { QueryTypes } = require('sequelize');
const { validationResult } = require('express-validator');
const { SERVER_ERROR_MSG } = require('../utils/messages');
const verifyProducts = require('../validation/verifyProducts');
const sequelize = require('../database/database');
const Delivery = require('../models/Delivery');
const Order = require('../models/Order');

async function createDelivery(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { id: userId } = req.user;
    const { pago_id, ordenes } = req.body;

    // Check if all the products in req.body exists in the database.
    const productsExists = await verifyProducts(ordenes);

    if (!productsExists)
      return res.status(404).json({ error: 'El producto no existe.' });

    // Create a new delivery and get its id.
    const [deliveryId] = await sequelize.query(
      `INSERT INTO deliveries (usuario_id, pago_id) VALUES (${userId}, ${pago_id})`
    );

    /* For each product I create a new order according to the quantity,
     * deliveryId and productId.
     */
    ordenes.forEach(async (order) => {
      const { producto_id, cantidad } = order;

      await sequelize.query(
        `INSERT INTO orders(orden_id, producto_id, cantidad) VALUES (${deliveryId}, ${producto_id}, ${cantidad})`
      );
    });

    // Fetch the recently created data from the database and send it in the res.
    const delivery = await sequelize.query(
      `SELECT id, usuario_id, estado_id, pago_id, fecha_hora FROM deliveries WHERE id=${deliveryId}`,
      { type: QueryTypes.SELECT, model: Delivery, mapToModel: true }
    );

    const orders = await sequelize.query(
      `SELECT producto_id, cantidad FROM orders WHERE orden_id=${deliveryId}`,
      { type: QueryTypes.SELECT, model: Order, mapToModel: true }
    );

    return res.status(200).json({
      message: 'Tu orden ha sido creada.',
      data: { pedido: delivery, ordenes: orders },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

function getDeliveries(req, res) {
  res.send('Getting all the orders.');
}

module.exports = { createDelivery, getDeliveries };
