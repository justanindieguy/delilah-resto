const { QueryTypes } = require('sequelize');
const { validationResult } = require('express-validator');
const { SERVER_ERROR_MSG } = require('../utils/messages');
const { getUpdateSentences } = require('../utils/utils');
const sequelize = require('../database/database');
const Product = require('../models/Product');

async function createProduct(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { nombre: name, precio: price } = req.body;

    const [id] = await sequelize.query(
      `INSERT INTO products(nombre, precio) VALUES ("${name}", ${price})`
    );

    const newProduct = await selectProduct(id);

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
    const products = await sequelize.query(
      'SELECT id, nombre, precio FROM products',
      {
        type: QueryTypes.SELECT,
        model: Product,
        mapToModel: true,
      }
    );

    if (products.length === 0) {
      return res
        .status(404)
        .json({ error: 'Aún no hay productos registrados.' });
    }

    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

async function getOneProduct(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id: productId } = req.params;
    const product = await selectProduct(productId);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    return res.status(200).json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

async function updateProduct(req, res) {
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
    const { id: productId } = req.params;
    const updateParams = { nombre: body.nombre, precio: body.precio };
    const setSentences = getUpdateSentences(updateParams);

    const [result] = await sequelize.query(
      `UPDATE products SET ${setSentences.join(', ')} WHERE id=${productId}`
    );

    if (result.affectedRows === 0) {
      return res.status(409).json({ message: 'Nada que actualizar.' });
    }

    const product = await selectProduct(productId);

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

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id: productId } = req.params;

    // prettier-ignore
    const [productExists] = await sequelize.query(
      `SELECT id, nombre, precio FROM products WHERE id=${productId}`,
      { type: QueryTypes.SELECT, model: Product, mapToModel: true }
    );

    if (!productExists) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    const [results] = await sequelize.query(
      `DELETE FROM products WHERE id=${productId}`
    );

    if (results.affectedRows !== 0) {
      return res.status(200).json({ message: 'Producto eliminado.' });
    }

    throw new Error('Something went wrong.');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

async function selectProduct(productId) {
  try {
    const [product] = await sequelize.query(
      `SELECT id, nombre, precio FROM products WHERE id=${productId}`,
      {
        type: QueryTypes.SELECT,
        model: Product,
        mapToModel: true,
      }
    );

    return product;
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = {
  createProduct,
  getProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
};
