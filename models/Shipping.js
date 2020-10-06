const Sequelize = require('sequelize');
const sequelize = require('../database/database');
const Order = require('./Order');

const Shipping = sequelize.define(
  'shipping',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fecha_hora: {
      type: Sequelize.DATE,
      defaultValue: Date.now(),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Shipping.hasMany(Order, { foreignKey: 'pedido_id', sourceKey: 'id' });
Order.belongsTo(Shipping, { foreignKey: 'pedido_id', sourceKey: 'id' });

module.exports = Shipping;
