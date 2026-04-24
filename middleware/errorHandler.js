const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            error: 'Validation error',
            details: err.errors.map(e => e.message)
        });
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
            error: 'Duplicate value',
            details: err.errors.map(e => e.message)
        });
    }

    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
            error: 'Invalid reference',
            details: err.message
        });
    }

    const statusCode = err.status || 500;

    res.status(statusCode).json({
        error: statusCode === 500
            ? 'Internal Server Error'
            : err.message
    });
};

module.exports = errorHandler;