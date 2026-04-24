const router = require('express').Router();
const { Update, Project } = require('../../database/index');
const {
    requireAuth,
    requireRole
} = require('../../middleware/auth');

// GET all updates
router.get('/', requireAuth, requireRole(['client', 'contractor']), async (req, res) => {
  try {
    const me = req.user.id;

    const projectWhere =
      req.user.role === 'client'
        ? { clientId: me }
        : { contractorId: me };

    const updates = await Update.findAll({
      include: [{
        model: Project,
        where: projectWhere,
        attributes: [],
        required: true,
      }],
    });

    return res.json(updates);
  } catch (err) {
    console.error('Error fetching updates:', err);
    return res.status(500).json({ error: 'Failed to fetch updates' });
  }
});

// GET one update by ID
router.get('/:id', requireAuth, requireRole(['client', 'contractor']), async (req, res) => {
  try {
    const me = req.user.id;

    const update = await Update.findByPk(req.params.id, {
      include: [{ model: Project, required: true }],
    });

    if (!update) {
      return res.status(404).json({ error: 'Update not found' });
    }

    const p = update.Project;
    if (p.clientId !== me && p.contractorId !== me) {
      return res.status(403).json({ error: 'You do not have access to this update' });
    }

    return res.json(update);
  } catch (err) {
    console.error('Error fetching update by id:', err);
    return res.status(500).json({ error: 'Failed to fetch update by id' });
  }
});

// POST create an update
router.post('/', requireAuth, requireRole(['contractor']), async (req, res) => {
  try {
    const { description, mediaUrl, status, projectId } = req.body;

    if (!description || !projectId) {
      return res.status(400).json({ error: 'Description and projectId are required' });
    }

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.contractorId !== req.user.id) {
      return res.status(403).json({ error: 'Only the assigned contractor can create updates for this project' });
    }

    const update = await Update.create({
      description,
      mediaUrl,
      status,
      projectId,
      userId: req.user.id,
    });

    return res.status(201).json(update);
  } catch (err) {
    console.error('Error creating an update:', err);
    return res.status(500).json({ error: 'Failed to create an update' });
  }
});

// PUT update an update
router.put('/:id', requireAuth, requireRole(['contractor']), async (req, res) => {
  try {
    const update = await Update.findByPk(req.params.id, {
      include: [{ model: Project, required: true }],
    });

    if (!update) {
      return res.status(404).json({ error: 'Update not found' });
    }

    if (update.Project.contractorId !== req.user.id) {
      return res.status(403).json({ error: 'Only the assigned contractor can update this update' });
    };

    if (update.userId !== req.user.id) {
  return res.status(403).json({ error: 'You can only edit updates you created' });
    }

    const { description, mediaUrl, status } = req.body;
    await update.update({ description, mediaUrl, status });

    return res.json(update);
  } catch (err) {
    console.error('Error updating an update:', err);
    return res.status(500).json({ error: 'Failed to update an update' });
  }
});

// DELETE an update
router.delete('/:id', requireAuth, requireRole(['contractor']), async (req, res) => {
  try {
    const update = await Update.findByPk(req.params.id, {
      include: [{ model: Project, required: true }],
    });

    if (!update) {
      return res.status(404).json({ error: 'Update not found' });
    }

    if (update.Project.contractorId !== req.user.id) {
      return res.status(403).json({ error: 'Only the assigned contractor can delete this update' });
    };

    if (update.userId !== req.user.id) {
    return res.status(403).json({ error: 'You can only delete updates you created' });
    };

    await update.destroy();
    return res.status(200).json({ message: 'Update deleted successfully' });
  } catch (err) {
    console.error('Error deleting an update:', err);
    return res.status(500).json({ error: 'Failed to delete an update' });
  }
});

module.exports = router;