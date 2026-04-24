const { Sequelize } = require('sequelize');
require('dotenv').config();

function createConnection() {
    const url = process.env.DATABASE_URL;
    if (url && String(url).trim() !== '') {
        return new Sequelize(url, {
            logging: false,
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            }
        });
    }
    return new Sequelize({
        dialect: 'sqlite',
        storage: `database/${process.env.DB_NAME || 'build4me.db'}`,
        logging: false
    });
}

const db = createConnection();

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

//Export
module.exports = db;
