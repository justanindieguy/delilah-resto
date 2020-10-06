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
      allowNull: false,
    },
    precio: {
      type: Sequelize.FLOAT(10, 2),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Product;
