const { QueryTypes } = require('sequelize');
const sequelize = require('../database/database');
const Product = require('../models/Product');

module.exports = async function (orders) {
  try {
    for (let order of orders) {
      const { producto_id } = order;

      const products = await sequelize.query(
        `SELECT nombre, precio FROM products WHERE id=${producto_id}`,
        {
          type: QueryTypes.SELECT,
          model: Product,
          mapToModel: true,
        }
      );

      if (products.length === 0) return false;
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
