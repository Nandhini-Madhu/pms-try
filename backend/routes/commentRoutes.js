const express = require('express');
const { body } = require('express-validator');
const {
  createTaskComment,
  getTaskComments,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.use(protect);

router.get('/task/:taskId', getTaskComments);

router.post(
  '/task/:taskId',
  [body('text').notEmpty().withMessage('Comment text is required')],
  validateRequest,
  createTaskComment
);

module.exports = router;
