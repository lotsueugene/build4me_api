const router = require('express').Router();
const { Project } = require('../../database/index');
const {
    requireAuth,
    requireRole,
    requireProjectOwner
} = require('../../middleware/auth');

// GET all projects
router.get('/', requireAuth, requireRole(['client', 'contractor']), async (req, res) => {
        try {
            const where = req.user.role === 'client'
                ? { clientId: req.user.id }
                : { contractorId: req.user.id };

            const projects = await Project.findAll({ where });
            res.json(projects);
        } catch (err) {
            console.error('Error fetching projects:', err);
            res.status(500).json({ error: 'Failed to fetch projects' });
        }
    }
);

// GET one project by ID
router.get('/:id',requireAuth,requireRole(['client', 'contractor']), async (req, res) => {
        try {
            const project = await Project.findByPk(req.params.id);
            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }
            const uid = req.user.id;
            const allowed = project.clientId === uid || project.contractorId === uid;
            if (!allowed) {
                return res.status(403).json({ error: 'You do not have access to this project' });
            }
            return res.json(project);
        } catch (err) {
            console.error('Error fetching project by id:', err);
            return res.status(500).json({ error: 'Failed to fetch project by id' });
        }
    }
);

// POST create a project
router.post('/', requireAuth, requireRole(['client']), async (req, res) => {
    try {
        const { title, description, location, startDate, status, contractorId } = req.body;
        if (!title || !location || !startDate) {
            return res.status(400).json({ error: 'Title, location, and startDate are required' });
        }
        const project = await Project.create({ title, description, location, startDate, status, clientId: req.user.id, contractorId });
        res.status(201).json(project);
    } catch (err) {
        console.error('Error creating a  project:', err);
        res.status(500).json({ error: 'Failed to craete a project'});
    }
});

// PUT update a project
router.put('/:id', requireAuth, requireRole(['client', 'contractor']), async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const me = req.user.id;
    const allowed = project.clientId === me || project.contractorId === me;
    if (!allowed) return res.status(403).json({ error: 'You do not have access to this project' });

    const { title, description, location, startDate, status } = req.body;
    await project.update({ title, description, location, startDate, status });

    return res.json(project);
  } catch (err) {
    console.error('Error updating a project:', err);
    return res.status(500).json({ error: 'Failed to update a project' });
  }
});

// DELETE a project
router.delete('/:id', requireAuth, requireRole(['client']), requireProjectOwner, async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        await project.destroy();
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (err) {
        console.error('Error deleting a project:', err);
        res.status(500).json({ error: 'Failed to delete a project'});
    }
});

module.exports = router;
