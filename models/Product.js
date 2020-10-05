const Sequelize = require('sequelize');
const sequelize = require('../database/database');

const Product = sequelize.define(
  'product',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: Sequelize.STRING,
    },
    precio: {
      type: Sequelize.FLOAT,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Product;
