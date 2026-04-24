const router = require('express').Router();
const { Inspection, Project } = require('../../database/index');
const {
    requireAuth,
    requireRole
} = require('../../middleware/auth');

// GET all inspections | Client and Inspector can view
router.get('/', requireAuth, requireRole(['inspector', 'client']), async (req, res) => {
    try {
        let inspections;

        if (req.user.role === 'client') {
            inspections = await Inspection.findAll({
                include: [{
                    model: Project,
                    where: { clientId: req.user.id },
                    required: true,
                    attributes: [],
                }],
            });
        } else {
            inspections = await Inspection.findAll({
                where: { inspectorId: req.user.id },
            });
        }

        return res.json(inspections);
    } catch (err) {
        console.error('Error fetching inspections:', err);
        return res.status(500).json({ error: 'Failed to fetch inspections' });
    }
});

// GET one inspection by ID | Client and Inspector can view
router.get('/:id', requireAuth, requireRole(['inspector', 'client']), async (req, res) => {
    try {
        const inspection = await Inspection.findOne({
            where: { id: req.params.id },
            include: [{ model: Project, required: true }],
        });

        if (!inspection) {
            return res.status(404).json({ error: 'Inspection not found' });
        }

        if (req.user.role === 'client') {
            if (inspection.Project.clientId !== req.user.id) {
                return res.status(403).json({ error: 'You do not have access to this inspection' });
            }
        } else if (req.user.role === 'inspector') {
            if (inspection.inspectorId !== req.user.id) {
                return res.status(403).json({ error: 'You do not have access to this inspection' });
            }
        }

        return res.json(inspection);
    } catch (err) {
        console.error('Error fetching inspection by id:', err);
        return res.status(500).json({ error: 'Failed to fetch inspection by id' });
    }
});



// POST create an inspection | Only an inspector can
router.post('/', requireAuth, requireRole(['inspector']), async (req, res) => {
    try {
        const { status, comments, inspectionDate, projectId, updateId } = req.body;

        if (!status || !projectId || !updateId) {
            return res.status(400).json({ error: 'Status, projectId, and updateId are required' });
        }

        if (req.body.inspectorId != null && Number(req.body.inspectorId) !== Number(req.user.id)) {
            return res.status(400).json({ error: 'inspectorId cannot be set to another user' });
        }

        const update = await Update.findByPk(updateId, {
            include: [{ model: Project, required: true }],
        });

        if (!update) {
            return res.status(404).json({ error: 'Update not found' });
        }

        if (Number(update.projectId) !== Number(projectId)) {
            return res.status(400).json({ error: 'updateId does not belong to the given projectId' });
        }

        const inspection = await Inspection.create({
            status,
            comments,
            inspectionDate,
            projectId,
            updateId,
            inspectorId: req.user.id,
        });

        return res.status(201).json(inspection);
    } catch (err) {
        console.error('Error creating an inspection:', err);
        return res.status(500).json({ error: 'Failed to create an inspection' });
    }
});

// PUT update an inspection | Only an inspector can
router.put('/:id', requireAuth, requireRole(['inspector']), async (req, res) => {
    try {
        const inspection = await Inspection.findByPk(req.params.id);
        if (!inspection) {
            return res.status(404).json({ error: 'Inspection not found' });
        }

        if (inspection.inspectorId !== req.user.id) {
            return res.status(403).json({ error: 'You can only edit inspections you created' });
        }

        const { status, comments, inspectionDate } = req.body;
        await inspection.update({ status, comments, inspectionDate });

        return res.json(inspection);
    } catch (err) {
        console.error('Error updating an inspection:', err);
        return res.status(500).json({ error: 'Failed to update an inspection' });
    }
});


// DELETE an inspection | Only an inspector can
router.delete('/:id', requireAuth, requireRole(['inspector']), async (req, res) => {
    try {
        const inspection = await Inspection.findByPk(req.params.id);
        if (!inspection) {
            return res.status(404).json({ error: 'Inspection not found' });
        }

        if (inspection.inspectorId !== req.user.id) {
            return res.status(403).json({ error: 'You can only delete inspections you created' });
        }

        await inspection.destroy();
        return res.status(200).json({ message: 'Inspection deleted successfully' });
    } catch (err) {
        console.error('Error deleting an inspection:', err);
        return res.status(500).json({ error: 'Failed to delete an inspection' });
    }
});

module.exports = router;