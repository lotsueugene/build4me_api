const express = require('express');
require('dotenv').config();

const {db} = require('./database/index');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const usersRouter = require('./routes/api/users');
const projectsRouter = require('./routes/api/projects');
const inspectionsRouter = require('./routes/api/inspections');
const updatesRouter = require('./routes/api/updates');


const app = express();

// Test database connection
async function testConnection() {
    try {
        await db.authenticate();
        console.log('Connection to database established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

testConnection();

// Middleware
app.use(express.json());
app.use(requestLogger);


// Routes
app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/inspections', inspectionsRouter);
app.use('/api/updates', updatesRouter);

// Error handler 
app.use(errorHandler);

module.exports = app;