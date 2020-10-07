const { QueryTypes } = require('sequelize');
const { validationResult } = require('express-validator');
const { SERVER_ERROR_MSG } = require('../utils/messages');
const { getUpdateSentences } = require('../utils/utils');
const sequelize = require('../database/database');
const Product = require('../models/Product');

async function createProduct(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { nombre: name, precio: price } = req.body;

    const [id] = await sequelize.query(
      `INSERT INTO products(nombre, precio) VALUES ("${name}", ${price})`
    );

    const [newProduct] = await sequelize.query(
      `SELECT id, nombre, precio FROM products WHERE id=${id}`,
      {
        type: QueryTypes.SELECT,
        model: Product,
        mapToModel: true,
      }
    );

    return res
      .status(200)
      .json({ message: 'Nuevo producto creado.', data: newProduct });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

async function getProducts(req, res) {
  try {
    const products = await sequelize.query('SELECT * FROM products', {
      type: QueryTypes.SELECT,
      model: Product,
      mapToModel: true,
    });

    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

async function getOneProduct(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { id } = req.params;
    const products = await sequelize.query(
      `SELECT id, nombre, precio FROM products WHERE id=${id}`,
      { type: QueryTypes.SELECT, model: Product, mapToModel: true }
    );

    if (products.length === 0)
      return res.status(404).json({ message: 'Producto no encontrado.' });

    return res.status(200).json(products[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

async function updateProduct(req, res) {
  const errors = validationResult(req);
  const body = req.body;

  if (!errors.isEmpty())
    return res.status(400).json({ error: errors.array() });

  if (Object.keys(body).length === 0 && body.constructor === Object)
    return res.status(400).json({
      error: 'Se requiere por lo menos un campo para actualizar.',
    });

  try {
    const { id } = req.params;
    const updateParams = { nombre: body.nombre, precio: body.precio };
    const setSentences = getUpdateSentences(updateParams);

    const [result] = await sequelize.query(
      `UPDATE products SET ${setSentences.join(', ')} WHERE id=${id}`
    );

    const [product] = await sequelize.query(
      `SELECT id, nombre, precio FROM products WHERE id=${id}`,
      {
        type: QueryTypes.SELECT,
        model: Product,
        mapToModel: true,
      }
    );

    if (result.affectedRows === 0)
      return res.status(409).json({ message: 'Nada que actualizar.' });

    return res
      .status(200)
      .json({ message: 'Producto actualizado.', data: product });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

async function deleteProduct(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { id } = req.params;
    const [results] = await sequelize.query(
      `DELETE FROM products WHERE id=${id}`
    );

    if (results.affectedRows === 0)
      return res.status(404).json({ error: 'Producto no encontrado.' });

    return res.status(200).json({ message: 'Producto eliminado.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

module.exports = {
  createProduct,
  getProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
};
