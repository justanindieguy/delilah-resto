const Sequelize = require('sequelize');
const sequelize = require('../database/database');
const Order = require('./Order');

const Delivery = sequelize.define(
  'delivery',
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

Delivery.hasMany(Order, { foreignKey: 'pedido_id', sourceKey: 'id' });
Order.belongsTo(Delivery, { foreignKey: 'pedido_id', sourceKey: 'id' });

module.exports = Delivery;
