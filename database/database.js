const Sequelize = require('sequelize');

const {
  DB_NAME: DATABASE,
  DB_USER: USER,
  DB_PASS: PASSWORD,
  DB_TIMEZONE: TIMEZONE,
} = process.env;

module.exports = new Sequelize(DATABASE, USER, PASSWORD, {
  host: 'localhost',
  dialect: 'mariadb',
  dialectOptions: {
    timezone: TIMEZONE,
  },

  pool: {
    max: 6,
    min: 0,
    require: 30000,
    idle: 10000,
  },

  loggin: false,
});
