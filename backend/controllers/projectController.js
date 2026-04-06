const Project = require('../models/Project');

const createProject = async (req, res, next) => {
  try {
    const { name, description, manager, teamMembers = [], status } = req.body;

    const project = await Project.create({
      name,
      description,
      manager,
      teamMembers,
      status,
      createdBy: req.user._id,
    });

    return res.status(201).json({ project });
  } catch (error) {
    return next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const query = {};

    if (req.user.role === 'manager') {
      query.$or = [{ manager: req.user._id }, { teamMembers: req.user._id }];
    }

    if (req.user.role === 'developer') {
      query.teamMembers = req.user._id;
    }

    const projects = await Project.find(query)
      .populate('manager', 'name email role')
      .populate('teamMembers', 'name email role')
      .sort({ createdAt: -1 });

    return res.json({ projects });
  } catch (error) {
    return next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('manager', 'name email role')
      .populate('teamMembers', 'name email role');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.json({ project });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createProject, getProjects, getProjectById };
