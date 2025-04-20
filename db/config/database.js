const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('./config');
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const sequelize = new Sequelize(config[env]);


module.exports = sequelize;