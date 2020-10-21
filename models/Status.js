const Sequelize = require('sequelize');
const sequelize = require('../database/database');
const Shipping = require('./Shipping');

const Status = sequelize.define(
  'status',
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
  },
  {
    timestamps: false,
  }
);

Status.hasMany(Shipping, { foreignKey: 'estado_id', sourceKey: 'id' });

module.exports = Status;
