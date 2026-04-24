const router = require('express').Router();
const { User } = require('../../database/index');
const requireAuth = require('../../middleware/auth');

// GET all users
router.get('/', requireAuth, async (req, res) => {
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
router.get('/:id', requireAuth, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
});

// POST create a user
router.post('/', requireAuth, async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }
        const user = await User.create({ name, email, password, role });
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
});

// PUT update a user
router.put('/:id',requireAuth, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.update(req.body);
        res.json(user);
    } catch (err) {
        next(err);
    }
});

// DELETE a user
router.delete('/:id', requireAuth, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.destroy();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;