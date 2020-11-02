const { QueryTypes } = require('sequelize');
const { validationResult } = require('express-validator');
const { SERVER_ERROR_MSG } = require('../utils/messages');
const verifyProducts = require('../validation/verifyProducts');
const sequelize = require('../database/database');
const Delivery = require('../models/Delivery');
const Order = require('../models/Order');

// Returns a string with the format: (1, 1, 2), (1, 2, 3)
function getOrderRows(deliveryId, orders) {
  const insertRows = [];

  orders.forEach((order) => {
    const { producto_id, cantidad } = order;
    insertRows.push(`(${deliveryId}, ${producto_id}, ${cantidad})`);
  });

  return insertRows.join(', ');
}

async function createDelivery(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id: userId } = req.user;
    const { pago_id, ordenes } = req.body;

    // Check if all the products in req.body exists in the database.
    const productsExists = await verifyProducts(ordenes);

    if (!productsExists) {
      return res.status(404).json({ error: 'El producto no existe.' });
    }

    // Create a new delivery and get its id.
    const [deliveryId] = await sequelize.query(
      `INSERT INTO deliveries (usuario_id, pago_id) VALUES (${userId}, ${pago_id})`
    );

    // Associates all the orders with the delivery id.
    await sequelize.query(
      `INSERT INTO orders(pedido_id, producto_id, cantidad) VALUES ${getOrderRows(
        deliveryId,
        ordenes
      )}`
    );

    // Fetch the recently created data from the database and send it in the res.

    // prettier-ignore
    const [delivery] = await sequelize.query(
      `SELECT d.id, u.email AS usuario, s.nombre AS estado, pm.nombre AS metodo_pago, d.fecha_hora FROM deliveries AS d INNER JOIN users AS u ON d.usuario_id = u.id INNER JOIN statuses AS s ON d.estado_id = s.id INNER JOIN payment_methods AS pm ON d.pago_id = pm.id WHERE d.id=${deliveryId}`,
      { type: QueryTypes.SELECT, model: Delivery, mapToModel: true }
    );

    const orders = await sequelize.query(
      `SELECT p.nombre AS producto, o.cantidad FROM orders AS o INNER JOIN products AS p ON o.producto_id = p.id WHERE o.pedido_id=${deliveryId}`,
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

async function getAllDeliveries(req, res) {
  try {
    const deliveries = await sequelize.query(
      `SELECT d.id, u.email, s.nombre AS estado, pm.nombre AS tipo_pago, d.fecha_hora FROM deliveries AS d JOIN statuses AS s ON d.estado_id = s.id JOIN payment_methods AS pm ON d.pago_id = pm.id JOIN users AS u ON d.usuario_id = u.id`,
      { type: QueryTypes.SELECT }
    );

    if (deliveries.length === 0) {
      return res.status(404).json({ error: 'Aún no hay pedidos.' });
    }

    for (let delivery of deliveries) {
      const { id: deliveryId } = delivery;

      await getDeliveryTotal(delivery, deliveryId);
      await getDeliveryProducts(delivery, deliveryId);
    }

    return res.status(200).json(deliveries);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

async function getUserDeliveries(req, res) {
  try {
    const { id: userId } = req.user;

    const deliveries = await sequelize.query(
      `SELECT d.id, u.email, s.nombre AS estado, pm.nombre AS tipo_pago, d.fecha_hora FROM deliveries AS d JOIN statuses AS s ON d.estado_id = s.id JOIN payment_methods AS pm ON d.pago_id = pm.id JOIN users AS u ON d.usuario_id = u.id WHERE u.id = ${userId}`,
      { type: QueryTypes.SELECT }
    );

    if (deliveries.length === 0) {
      return res.status(404).json({ message: 'Aún no tienes pedidos.' });
    }

    for (let delivery of deliveries) {
      const { id: deliveryId } = delivery;

      await getDeliveryTotal(delivery, deliveryId);
      await getDeliveryProducts(delivery, deliveryId);
    }

    return res.status(200).json(deliveries);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

async function getOneDelivery(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  try {
    const { id: userId } = req.user;
    const { id: deliveryId } = req.params;

    // prettier-ignore
    const [delivery] = await sequelize.query(
      `SELECT d.id, u.email, s.nombre AS estado, pm.nombre AS tipo_pago, d.fecha_hora FROM deliveries AS d JOIN statuses AS s ON d.estado_id = s.id JOIN payment_methods AS pm ON d.pago_id = pm.id JOIN users AS u ON d.usuario_id = u.id WHERE u.id = ${userId} AND d.id=${deliveryId}`,
      { type: QueryTypes.SELECT }
    );

    if (!delivery) {
      return res.status(404).json({
        error:
          'No hay ningún pedido con el ID indicado asociado a este usuario.',
      });
    }

    await getDeliveryTotal(delivery, deliveryId);
    await getDeliveryProducts(delivery, deliveryId);

    return res.status(200).json(delivery);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

async function getDeliveryProducts(delivery, deliveryId) {
  const products = await sequelize.query(
    `SELECT p.nombre, p.precio, o.cantidad, (o.cantidad * p.precio) AS total FROM orders AS o JOIN products AS p ON o.producto_id = p.id WHERE o.pedido_id = ${deliveryId};`,
    { type: QueryTypes.SELECT }
  );

  delivery.productos = products;
}

async function getDeliveryTotal(delivery, deliveryId) {
  delivery.total = 0;

  // prettier-ignore
  const [{ total }] = await sequelize.query(
    `SELECT SUM(o.cantidad * p.precio) AS total FROM orders AS o JOIN products AS p ON p.id = o.producto_id WHERE o.pedido_id = ${deliveryId} GROUP BY o.pedido_id;`,
    { type: QueryTypes.SELECT }
  );

  delivery.total = total;
}

async function updateDelivery(req, res) {
  const errors = validationResult(req);
  const body = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  if (Object.keys(body).length === 0 && body.constructor === Object) {
    return res
      .status(400)
      .json({ error: 'Se requiere por lo menos un campo para actualizar.' });
  }

  try {
    const { id } = req.params;
    const { estado_id } = body;

    const [result] = await sequelize.query(
      `UPDATE deliveries SET estado_id=${estado_id} WHERE id=${id}`
    );

    if (result.affectedRows === 0) {
      return res.status(409).json({ message: 'Nada que actualizar.' });
    }

    // prettier-ignore
    const [product] = await sequelize.query(
      `SELECT d.id, u.email, s.nombre AS estado, pm.nombre AS tipo_pago, d.fecha_hora FROM deliveries AS d JOIN statuses AS s ON d.estado_id = s.id JOIN payment_methods AS pm ON d.pago_id = pm.id JOIN users AS u ON d.usuario_id = u.id WHERE d.id = ${id}`,
      { type: QueryTypes.SELECT }
    );

    return res
      .status(200)
      .json({ message: 'Pedido actualizado.', data: product });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

async function deleteDelivery(req, res) {
  const errors = validationResult(req);
  const { id: deliveryId } = req.params;

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const [deliveryExists] = await sequelize.query(
      `SELECT id, fecha_hora FROM deliveries WHERE id=${deliveryId}`
    );

    if (!deliveryExists) {
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    }

    const [results] = await sequelize.query(
      `DELETE FROM deliveries WHERE id=${deliveryId}`
    );

    if (results.affectedRows !== 0) {
      return res.status(200).json({ message: 'Pedido eliminado.' });
    }

    throw new Error('Something went wrong.');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

module.exports = {
  createDelivery,
  getAllDeliveries,
  getUserDeliveries,
  getOneDelivery,
  updateDelivery,
  deleteDelivery,
};
