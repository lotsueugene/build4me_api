const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();


// Initialize database connection
const db = new Sequelize({
    dialect: 'sqlite',
    storage: `database/${process.env.DB_NAME || 'build4me.db'}`,
    logging: false
});

// Initialize database
async function initializeDatabase() {
    try {
        await db.authenticate();
        console.log('Database connection established successfully.');
        
        await db.sync({ force: false });
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to database:', error);
    }
}

initializeDatabase();

module.exports = db;