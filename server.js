const express = require('express');
require('dotenv').config();
const app = express();

const { db } = require('./database/index');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const usersRouter = require('./routes/api/users');
const projectsRouter = require('./routes/api/projects');
const inspectionsRouter = require('./routes/api/inspections');
const updatesRouter = require('./routes/api/updates');

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});