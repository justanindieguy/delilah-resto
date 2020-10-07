const Sequelize = require('sequelize');
const sequelize = require('../database/database');
const Delivery = require('./Delivery');

const User = sequelize.define(
  'user',
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
    apellido_p: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    apellido_m: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    telefono: {
      type: Sequelize.CHAR(10),
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    pass: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    direccion: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    admin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  }
);

User.hasMany(Delivery, { foreignKey: 'usuario:id', sourceKey: 'id' });

module.exports = User;
