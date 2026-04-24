const router = require('express').Router();
const { Inspection } = require('../../database/index');
const requireAuth = require('../../middleware/auth');

// GET all inspections
router.get('/', async (req, res, next) => {
    try {
        const inspections = await Inspection.findAll();
        res.json(inspections);
    } catch (err) {
        next(err);
    }
});

// GET one inspection by ID
router.get('/:id', requireAuth, async (req, res, next) => {
    try {
        const inspection = await Inspection.findByPk(req.params.id);
        if (!inspection) {
            return res.status(404).json({ error: 'Inspection not found' });
        }
        res.json(inspection);
    } catch (err) {
        next(err);
    }
});

// POST create an inspection
router.post('/', requireAuth, async (req, res, next) => {
    try {
        const { status, comments, inspectionDate, projectId, inspectorId, updateId } = req.body;
        if (!status || !projectId || !inspectorId || !updateId) {
            return res.status(400).json({ error: 'Status, projectId, inspectorId, and updateId are required' });
        }
        const inspection = await Inspection.create({ status, comments, inspectionDate, projectId, inspectorId, updateId });
        res.status(201).json(inspection);
    } catch (err) {
        next(err);
    }
});

// PUT update an inspection
router.put('/:id',requireAuth, async (req, res, next) => {
    try {
        const inspection = await Inspection.findByPk(req.params.id);
        if (!inspection) {
            return res.status(404).json({ error: 'Inspection not found' });
        }
        await inspection.update(req.body);
        res.json(inspection);
    } catch (err) {
        next(err);
    }
});

// DELETE an inspection
router.delete('/:id', requireAuth, async (req, res, next) => {
    try {
        const inspection = await Inspection.findByPk(req.params.id);
        if (!inspection) {
            return res.status(404).json({ error: 'Inspection not found' });
        }
        await inspection.destroy();
        res.status(200).json({ message: 'Inspection deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;