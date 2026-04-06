const Task = require('../models/Task');
const Project = require('../models/Project');

const createTask = async (req, res, next) => {
  try {
    const { project, title, description, priority, status, deadline, assignee } = req.body;

    const existingProject = await Project.findById(project);
    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = await Task.create({
      project,
      title,
      description,
      priority,
      status,
      deadline,
      assignee,
      createdBy: req.user._id,
    });

    return res.status(201).json({ task });
  } catch (error) {
    return next(error);
  }
};

const getTasksByProject = async (req, res, next) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignee', 'name email role')
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    return res.json({ tasks });
  } catch (error) {
    return next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const canEdit =
      req.user.role === 'admin' ||
      String(task.createdBy) === String(req.user._id) ||
      String(task.assignee) === String(req.user._id);

    if (!canEdit) {
      return res.status(403).json({ message: 'Not allowed to update this task' });
    }

    const allowedFields = ['title', 'description', 'priority', 'status', 'deadline', 'assignee'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    await task.save();

    const updatedTask = await Task.findById(task._id).populate('assignee', 'name email role');
    return res.json({ task: updatedTask });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createTask, getTasksByProject, updateTask };
