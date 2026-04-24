const jwt = require('jsonwebtoken');
const { Project } = require('../database/index');


// JWT Authentication Middleware
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            error: 'Access denied. No token provided.' 
        });
    }
    
    const token = authHeader.substring(7);
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Token expired. Please log in again.' 
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                error: 'Invalid token. Please log in again.' 
            });
        } else {
            return res.status(401).json({ 
                error: 'Token verification failed.' 
            });
        }
    }
};


// Role-based authorization
function requireRole(allowed) {
    return (req, res, next) => {
        if (!req.user) {
            console.warn(`[auth] requireRole hit without req.user on ${req.method} ${req.originalUrl}`);
            return res.status(401).json({ error: 'Not authenticated' });
        }
        if (!allowed.includes(req.user.role)) {
            console.warn(`[auth] Role denied: user ${req.user.id} (role=${req.user.role}) tried ${req.method} ${req.originalUrl}; allowed=[${allowed.join(', ')}]`);
            return res.status(403).json({ error: 'Forbidden: insufficient role' });
        }
        return next();
    };
}



// Only the client who owns the project
async function requireProjectOwner(req, res, next) {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            console.info(`[auth] Project ${req.params.id} not found (${req.method} ${req.originalUrl})`);
            return res.status(404).json({ error: 'Project not found' });
        }
        if (project.clientId !== req.user.id) {
            console.warn(`[auth] Ownership denied: user ${req.user.id} is not owner of project ${project.id} (${req.method} ${req.originalUrl})`);
            return res.status(403).json({ error: 'Only the project owner can do this' });
        };
        req.project = project; 
        return next();
    } catch (err) {
        console.error(`[auth] Error in requireProjectOwner on ${req.method} ${req.originalUrl}:`, err);
        return next(err);
    }
}


module.exports = {
    requireAuth,
    requireRole,
    requireProjectOwner
};