const router = require('express').Router();
const { Inspection } = require('../../database/index');
const {
    requireAuth,
    requireRole
} = require('../../middleware/auth');

// GET all inspections | Client and Inspector can view
router.get('/', requireAuth, requireRole(['inspector', 'client']), async (req, res) => {
    try {
        let where = {};

        if (req.user.role === 'client') {
            where = { clientId: req.user.id };
        } else if (req.user.role === 'inspector') {
            where = { inspectorId: req.user.id };
        }

        const inspections = await Inspection.findAll({ where });

        res.json(inspections);
    } catch (err) {
        console.error('Error fetching inspections:', err);
        res.status(500).json({ error: 'Failed to fetch inspections' });
    }
});

// GET one inspection by ID | Client and Inspector can view
router.get('/:id', requireAuth, requireRole(['inspector','client']), async (req, res) => {
    try {
        let where = { id: req.params.id };

        if (req.user.role === 'client') {
            where.clientId = req.user.id;
        } else if (req.user.role === 'inspector') {
            where.inspectorId = req.user.id;
        }

        const inspection = await Inspection.findOne({ where });

        if (!inspection) {
            return res.status(404).json({ error: 'Inspection not found' });
        }

        res.json(inspection);
    } catch (err) {
        console.error('Error fetching inspection by id:', err);
        res.status(500).json({ error: 'Failed to fetch inspection by id'});
    }
});

// POST create an inspection | Only an inspector can
router.post('/', requireAuth,requireRole(['inspector']), async (req, res) => {
    try {
        const { status, comments, inspectionDate, projectId, inspectorId, updateId } = req.body;
        if (!status || !projectId || !inspectorId || !updateId) {
            return res.status(400).json({ error: 'Status, projectId, inspectorId, and updateId are required' });
        }
        const inspection = await Inspection.create({ status, comments, inspectionDate, projectId, inspectorId, updateId });
        res.status(201).json(inspection);
    } catch (err) {
        console.error('Error creating an inspection:', err);
        res.status(500).json({ error: 'Failed to create an inspection'});
    }
});

// PUT update an inspection | Only an inspector can
router.put('/:id',requireAuth, requireRole(['inspector']), async (req, res) => {
    try {
        const inspection = await Inspection.findByPk(req.params.id);
        if (!inspection) {
            return res.status(404).json({ error: 'Inspection not found' });
        }
        await inspection.update(req.body);
        res.json(inspection);
    } catch (err) {
        console.error('Error updating an inspection:', err);
        res.status(500).json({ error: 'Failed to update an inspection'});
    }
});

// DELETE an inspection | Only an inspector can
router.delete('/:id', requireAuth, requireRole(['inspector']), async (req, res) => {
    try {
        const inspection = await Inspection.findByPk(req.params.id);
        if (!inspection) {
            return res.status(404).json({ error: 'Inspection not found' });
        }
        await inspection.destroy();
        res.status(200).json({ message: 'Inspection deleted successfully' });
    } catch (err) {
        console.error('Error deleting an inspection:', err);
        res.status(500).json({ error: 'Failed to delete an inspection'});
    }
});

module.exports = router;