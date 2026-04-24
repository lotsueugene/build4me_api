const router = require('express').Router();
const { Update } = require('../../database/index');
const requireAuth = require('../../middleware/auth');

// GET all updates
router.get('/', requireAuth, async (req, res, next) => {
    try {
        const updates = await Update.findAll();
        res.json(updates);
    } catch (err) {
        console.error('Error fetching all updates:', err);
        res.status(500).json({ error: 'Failed to fetch all updates' });
    }
});

// GET one update by ID
router.get('/:id', requireAuth,  async (req, res, next) => {
    try {
        const update = await Update.findByPk(req.params.id);
        if (!update) {
            return res.status(404).json({ error: 'Update not found' });
        }
        res.json(update);
    } catch (err) {
        console.error('Error fetching update by id:', err);
        res.status(500).json({ error: 'Failed to fetch  update by id' });
    }
});

// POST create an update
router.post('/', requireAuth, async (req, res, next) => {
    try {
        const { description, mediaUrl, status, projectId, userId } = req.body;
        if (!description || !projectId || !userId) {
            return res.status(400).json({ error: 'Description, projectId, and userId are required' });
        }
        const update = await Update.create({ description, mediaUrl, status, projectId, userId });
        res.status(201).json(update);
    } catch (err) {
        console.error('Error creating an update:', err);
        res.status(500).json({ error: 'Failed to create an update' });
    }
});

// PUT update an update
router.put('/:id', requireAuth, async (req, res, next) => {
    try {
        const update = await Update.findByPk(req.params.id);
        if (!update) {
            return res.status(404).json({ error: 'Update not found' });
        }
        await update.update(req.body);
        res.json(update);
    } catch (err) {
        console.error('Error updating an update:', err);
        res.status(500).json({ error: 'Failed to update an update' });
    }
});

// DELETE an update
router.delete('/:id', requireAuth, async (req, res, next) => {
    try {
        const update = await Update.findByPk(req.params.id);
        if (!update) {
            return res.status(404).json({ error: 'Update not found' });
        }
        await update.destroy();
        res.status(200).json({ message: 'Update deleted successfully' });
    } catch (err) {
        console.error('Error deleting an update:', err);
        res.status(500).json({ error: 'Failed to delete an update' });
    }
});

module.exports = router;