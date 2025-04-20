const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTaskById, updateTask, deleteTask, filterTasks, getManagerTasks } = require('../controllers/taskController');
const auth = require('../middlewares/authMiddleware');

router.post('/create-task', auth, createTask);
router.get('/', auth, getTasks);
router.get('/:taskId', auth, getTaskById);
router.post('/update-task/:taskId', auth, updateTask);
router.post('/delete-task/:taskId', auth, deleteTask);
//filter tasks


router.post('/filter-tasks', auth, filterTasks);

module.exports = router;
