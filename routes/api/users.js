const router = require('express').Router();
const { User } = require('../../database/index');
const {
    requireAuth,
    requireRole,
    requireAdmin
} = require('../../middleware/auth');

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
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error fetching user by id:', err);
        res.status(500).json({ error: 'Failed to fetch user by id' });
    }
});

// POST create a user
router.post('/', requireAuth,requireAdmin, async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }
        const user = await User.create({ name, email, password, role });
        res.status(201).json(user);
    } catch (err) {
        console.error('Error creating a user:', err);
        res.status(500).json({ error: 'Failed to create a user' });
    }
});

// PUT update a user
router.put('/:id',requireAuth, requireAdmin, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.update(req.body);
        res.json(user);
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Failed to update a user' });
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