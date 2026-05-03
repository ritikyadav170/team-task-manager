import express from 'express';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, async (req, res) => {
    try {
      const { name, description } = req.body;
      const project = new Project({ name, description, owner: req.user._id });
      const createdProject = await project.save();
      res.status(201).json(createdProject);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .get(protect, async (req, res) => {
    try {
      const projects = await Project.find({}).populate('owner', 'name email');
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.route('/:id')
  .get(protect, async (req, res) => {
    try {
      const project = await Project.findById(req.params.id).populate('owner', 'name email');
      if (project) {
        res.json(project);
      } else {
        res.status(404).json({ message: 'Project not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .delete(protect, admin, async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (project) {
        await Task.deleteMany({ project: project._id });
        await project.deleteOne();
        res.json({ message: 'Project removed' });
      } else {
        res.status(404).json({ message: 'Project not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

export default router;
