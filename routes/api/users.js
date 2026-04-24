const router = require('express').Router();
const { User } = require('../../database/index');
const {
    requireAuth,
    requireAdmin
} = require('../../middleware/auth');
const bcrypt = require('bcrypt');

// GET all users
router.get('/', requireAuth,requireAdmin, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role'] // Don't return passwords
        });
        
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// GET one user by ID
router.get('/:id', requireAuth,requireAdmin, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: ['id', 'name', 'email', 'role'],
        });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json(user);
    } catch (err) {
        console.error('Error fetching user by id:', err);
        res.status(500).json({ error: 'Failed to fetch user by id' });
    }
});

// POST create a user
router.post('/', requireAuth, requireAdmin, async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        const allowedRoles = ['client', 'contractor', 'inspector', 'admin'];
        const resolvedRole = role ?? 'client';
        if (!allowedRoles.includes(resolvedRole)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: resolvedRole,
        });

        const safe = await User.findByPk(user.id, {
            attributes: ['id', 'name', 'email', 'role'],
        });
        return res.status(201).json(safe);
    } catch (err) {
        console.error('Error creating a user:', err);
        return res.status(500).json({ error: 'Failed to create a user' });
    }
});

// PUT update a user
router.put('/:id', requireAuth, requireAdmin, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { name, email, role, password } = req.body;
        const payload = {};

        if (name !== undefined) payload.name = name;
        if (email !== undefined) payload.email = email;
        if (role !== undefined) {
            const allowedRoles = ['client', 'contractor', 'inspector', 'admin'];
            if (!allowedRoles.includes(role)) {
                return res.status(400).json({ error: 'Invalid role' });
            }
            payload.role = role;
        }
        if (password !== undefined && password !== '') {
            payload.password = await bcrypt.hash(password, 10);
        }

        if (Object.keys(payload).length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        await user.update(payload);

        const safe = await User.findByPk(user.id, {
            attributes: ['id', 'name', 'email', 'role'],
        });
        return res.json(safe);
    } catch (err) {
        console.error('Error updating user:', err);
        return res.status(500).json({ error: 'Failed to update a user' });
    }
});

// DELETE a user
router.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.destroy();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;