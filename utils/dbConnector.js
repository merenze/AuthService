// utils/dbConnector.js
const { Sequelize } = require('sequelize');
const dbConnector = require('../utils/dbConnector.js');

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;