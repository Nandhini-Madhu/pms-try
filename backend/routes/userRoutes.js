const express = require('express');
const { body } = require('express-validator');
const { createUser, getUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.use(protect, allowRoles('admin'));

router.get('/', getUsers);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['admin', 'manager', 'developer']).withMessage('Invalid role'),
  ],
  validateRequest,
  createUser
);

module.exports = router;
