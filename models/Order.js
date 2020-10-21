const Sequelize = require('sequelize');
const sequelize = require('../database/database');

const Order = sequelize.define(
  'order',
  {
    pedido_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    producto_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    cantidad: {
      type: Sequelize.INTEGER,
    },
    total: {
      type: Sequelize.FLOAT,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Order;
