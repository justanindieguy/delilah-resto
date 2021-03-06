const Sequelize = require('sequelize');
const sequelize = require('../database/database');
const Order = require('./Order');

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

Product.hasMany(Order, { foreignKey: 'pedido_id', sourceKey: 'id' });

module.exports = Product;
