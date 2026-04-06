const Project = require('../models/Project');
const Task = require('../models/Task');
const Comment = require('../models/Comment');

const getOverview = async (req, res, next) => {
  try {
    const [totalProjects, tasksByStatusRaw, recentComments] = await Promise.all([
      Project.countDocuments(),
      Task.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Comment.find()
        .populate('user', 'name')
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    const tasksByStatus = { Todo: 0, 'In Progress': 0, Done: 0 };
    tasksByStatusRaw.forEach((row) => {
      tasksByStatus[row._id] = row.count;
    });

    const recentActivity = recentComments.map((comment) => ({
      _id: comment._id,
      action: `Comment added: ${comment.text.slice(0, 60)}`,
      user: comment.user,
      timestamp: comment.createdAt,
    }));

    return res.json({ totalProjects, tasksByStatus, recentActivity });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getOverview };
