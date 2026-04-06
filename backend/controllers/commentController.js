const Comment = require('../models/Comment');
const Task = require('../models/Task');

const createTaskComment = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const comment = await Comment.create({
      task: taskId,
      user: req.user._id,
      text,
    });

    const populated = await Comment.findById(comment._id).populate('user', 'name email role');
    return res.status(201).json({ comment: populated });
  } catch (error) {
    return next(error);
  }
};

const getTaskComments = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const comments = await Comment.find({ task: taskId })
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    return res.json({ comments });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createTaskComment, getTaskComments };
