const express = require('express');
const { body } = require('express-validator');
const {
  createTask,
  getTasksByProject,
  updateTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.use(protect);

router.get('/project/:projectId', getTasksByProject);

router.post(
  '/',
  [
    body('project').notEmpty().withMessage('Project ID is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('priority').optional().isIn(['Low', 'Medium', 'High']),
    body('status').optional().isIn(['Todo', 'In Progress', 'Done']),
  ],
  validateRequest,
  createTask
);

router.patch('/:taskId', updateTask);

module.exports = router;
