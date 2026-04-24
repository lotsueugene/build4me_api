const router = require('express').Router();
const { Project } = require('../../database/index');
const requireAuth = require('../../middleware/auth');

// GET all projects
router.get('/', requireAuth, async (req, res, next) => {
    try {
        const projects = await Project.findAll();
        res.json(projects);
    } catch (err) {
        next(err);
    }
});

// GET one project by ID
router.get('/:id', requireAuth, async (req, res, next) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (err) {
        next(err);
    }
});

// POST create a project
router.post('/', requireAuth, async (req, res, next) => {
    try {
        const { title, description, location, startDate, status, clientId, contractorId } = req.body;
        if (!title || !location || !startDate) {
            return res.status(400).json({ error: 'Title, location, and startDate are required' });
        }
        const project = await Project.create({ title, description, location, startDate, status, clientId, contractorId });
        res.status(201).json(project);
    } catch (err) {
        next(err);
    }
});

// PUT update a project
router.put('/:id', requireAuth, async (req, res, next) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        await project.update(req.body);
        res.json(project);
    } catch (err) {
        next(err);
    }
});

// DELETE a project
router.delete('/:id', requireAuth, async (req, res, next) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        await project.destroy();
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
