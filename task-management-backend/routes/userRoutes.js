const express = require('express');
const router = express.Router();
const { createUser, getUsers, getUserById, updateUser, deleteUser, getManagedUsers, assignUserToManager, assignUsersByRole, selfAssignManager, updateUserManager, getAssignedUsers, getAssignedManager, getAllManagers, updateTaskStatus } = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/authMiddleware');

router.post('/register', createUser);
router.get('/all-users', auth, getUsers);
router.get('/:userId', auth, getUserById);
router.post('/update-user/:userId', auth, updateUser);
router.post('/delete-user/:userId', auth, deleteUser);
// Get users managed by a manager
router.get('/managed-users', auth, getManagedUsers)
router.post('/admin/assign-user', auth, assignUserToManager);
// Endpoint for updating user manager
router.post('/admin/update-user-manager', auth, updateUserManager);
// Endpoint to get all users assigned to a manager
router.get('/manager/get-assigned-users', getAssignedUsers);
//get all mnager
router.get('/admin/get-all-managers', auth, getAllManagers);


// Endpoint to get assigned manager for a user
router.get('/user/get-assigned-manager', auth, getAssignedManager);
//update task sttaus
router.post('/task-status/:taskId', auth, updateTaskStatus);
module.exports = router;
