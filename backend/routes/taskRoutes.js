const express = require('express');
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  markComplete,
  getAnalytics,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Analytics route (must be before /:id to avoid conflict)
router.get('/analytics/summary', getAnalytics);

// CRUD routes
router.route('/').get(getTasks).post(createTask);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);
router.patch('/:id/complete', markComplete);

module.exports = router;
