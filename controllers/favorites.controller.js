const { QueryTypes } = require('sequelize');
const { validationResult } = require('express-validator');
const { SERVER_ERROR_MSG } = require('../utils/messages');
const Sequelize = require('sequelize');
const sequelize = require('../database/database');
const Product = require('../models/Product');

async function getFavorites(req, res) {
  try {
    const { id: userId } = req.user;
    const favorites = await sequelize.query(
      `SELECT p.id, p.nombre, p.precio FROM favorites AS f JOIN products AS p ON f.producto_id = p.id WHERE f.usuario_id = ${userId};`,
      { type: QueryTypes.SELECT, model: Product, mapToModel: true }
    );

    if (favorites.length === 0) {
      return res.status(404).json({ error: 'Aún no tienes favoritos.' });
    }

    return res.status(200).json(favorites);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

async function addFavorite(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id: userId } = req.user;
    const { producto_id: productId } = req.body;

    // prettier-ignore
    const [productExists] = await sequelize.query(
      `SELECT id, nombre, precio FROM products WHERE id=${productId}`,
      { type: QueryTypes.SELECT, model: Product, mapToModel: true }
    );

    if (!productExists) {
      return res
        .status(404)
        .json({ error: 'No se ha encontrado el producto.' });
    }

    const result = await sequelize.query(
      `INSERT INTO favorites(usuario_id, producto_id) VALUES (${userId}, ${productId})`,
      { type: QueryTypes.INSERT }
    );

    if (result) {
      return res
        .status(200)
        .json({ message: 'Producto añadido a favoritos.' });
    } else {
      throw new Error();
    }
  } catch (err) {
    console.error(err);

    if (err instanceof Sequelize.UniqueConstraintError) {
      return res
        .status(409)
        .json({ error: 'Este producto ya está en tus favoritos.' });
    }

    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

async function removeFavorite(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id: userId } = req.user;
    const { productId } = req.params;

    // prettier-ignore
    const [favoriteExists] = await sequelize.query(
      `SELECT usuario_id, producto_id FROM favorites WHERE usuario_id=${userId} AND producto_id=${productId}`,
      { type: QueryTypes.SELECT }
    );

    if (!favoriteExists) {
      return res
        .status(404)
        .json({ error: 'Este producto no está en tus favoritos.' });
    }

    const [results] = await sequelize.query(
      `DELETE FROM favorites WHERE usuario_id=${userId} AND producto_id=${productId}`
    );

    if (results.affectedRows !== 0) {
      return res
        .status(200)
        .json({ message: 'Producto eliminado de favoritos.' });
    }

    throw new Error('Something went wrong.');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

module.exports = { getFavorites, addFavorite, removeFavorite };
