const express = require('express');
const { body } = require('express-validator');
const {
  createProject,
  getProjects,
  getProjectById,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.use(protect);

router.get('/', getProjects);
router.get('/:projectId', getProjectById);

router.post(
  '/',
  allowRoles('admin', 'manager'),
  [
    body('name').notEmpty().withMessage('Project name is required'),
    body('description').notEmpty().withMessage('Project description is required'),
    body('manager').notEmpty().withMessage('Manager user ID is required'),
    body('status').optional().isIn(['Active', 'Completed']),
  ],
  validateRequest,
  createProject
);

module.exports = router;
