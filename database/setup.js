const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();


// Initialize database connection
const db = new Sequelize({
    dialect: 'sqlite',
    storage: `database/${process.env.DB_NAME}` || 'build4me.db',
    logging: false
});


module.exports = db;