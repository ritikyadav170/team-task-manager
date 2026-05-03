import express from 'express';
import Task from '../models/Task.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, async (req, res) => {
    try {
      const { title, description, status, dueDate, project, assignee } = req.body;
      const task = new Task({ title, description, status, dueDate, project, assignee: assignee || null });
      const createdTask = await task.save();
      const populatedTask = await Task.findById(createdTask._id).populate('assignee', 'name email').populate('project', 'name');
      res.status(201).json(populatedTask);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .get(protect, async (req, res) => {
    try {
      const tasks = await Task.find({}).populate('assignee', 'name email').populate('project', 'name');
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.route('/:id')
  .put(protect, async (req, res) => {
    try {
      const { title, description, status, dueDate, assignee } = req.body;
      const task = await Task.findById(req.params.id);

      if (!task) return res.status(404).json({ message: 'Task not found' });
      if (req.user.role !== 'Admin') {
        if (task.assignee?.toString() !== req.user._id.toString()) {
          return res.status(401).json({ message: 'Not authorized to update this task' });
        }
        task.status = status || task.status;
      } else {
        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        task.dueDate = dueDate || task.dueDate;
        task.assignee = assignee || task.assignee;
      }

      const updatedTask = await task.save();
      const populatedUpdate = await Task.findById(updatedTask._id).populate('assignee', 'name email').populate('project', 'name');
      res.json(populatedUpdate);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
  .delete(protect, admin, async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (task) {
        await task.deleteOne();
        res.json({ message: 'Task removed' });
      } else {
        res.status(404).json({ message: 'Task not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

export default router;
