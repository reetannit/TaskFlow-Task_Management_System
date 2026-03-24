const Task = require('../models/Task');

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks for current user (with filter, search, sort, pagination)
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, sortBy, sortOrder, page, limit } = req.query;

    // Build query
    const query = { user: req.user.id };

    // Filter by status
    if (status && ['todo', 'in-progress', 'done'].includes(status)) {
      query.status = status;
    }

    // Filter by priority
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      query.priority = priority;
    }

    // Search by title
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Sort
    let sortOptions = { createdAt: -1 }; // default: newest first
    if (sortBy) {
      const order = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'dueDate') sortOptions = { dueDate: order };
      else if (sortBy === 'priority') {
        // Custom sort for priority: high=3, medium=2, low=1
        sortOptions = { priority: order };
      } else if (sortBy === 'createdAt') sortOptions = { createdAt: order };
      else if (sortBy === 'title') sortOptions = { title: order };
    }

    const [tasks, total] = await Promise.all([
      Task.find(query).sort(sortOptions).skip(skip).limit(limitNum),
      Task.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark task as completed
// @route   PATCH /api/tasks/:id/complete
// @access  Private
exports.markComplete = async (req, res, next) => {
  try {
    let task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: 'done' },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task analytics
// @route   GET /api/tasks/analytics/summary
// @access  Private
exports.getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [statusStats, priorityStats, totalCount] = await Promise.all([
      // Group by status
      Task.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      // Group by priority
      Task.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
      // Total count
      Task.countDocuments({ user: userId }),
    ]);

    // Transform status stats
    const statusMap = { todo: 0, 'in-progress': 0, done: 0 };
    statusStats.forEach((s) => {
      statusMap[s._id] = s.count;
    });

    // Transform priority stats
    const priorityMap = { low: 0, medium: 0, high: 0 };
    priorityStats.forEach((p) => {
      priorityMap[p._id] = p.count;
    });

    const completionPercentage =
      totalCount > 0 ? Math.round((statusMap.done / totalCount) * 100) : 0;

    // Overdue tasks
    const overdueTasks = await Task.countDocuments({
      user: userId,
      status: { $ne: 'done' },
      dueDate: { $lt: new Date(), $ne: null },
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalCount,
        statusBreakdown: statusMap,
        priorityBreakdown: priorityMap,
        completionPercentage,
        overdueTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};
