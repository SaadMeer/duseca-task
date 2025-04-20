const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Manager = require('../models/Manager');
const User = require('../models/RegularUser');
const Task = require('../models/Task');

exports.createUser = async (req, res) => {
    const { name, email, password, role, assignedUsers } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    let created;
    if (role === 'manager') {
        created = await Manager.create({ name, email, password: hashedPassword, assignedUsers });
    }
    //if role is admin
    else if (role === 'admin') {
        created = await Admin.create({ name, email, password: hashedPassword });
    }
    else {
        created = await User.create({ name, email, password: hashedPassword });
    }
    res.status(201).json(created);
};
// Get all users (Admin only)
exports.getUsers = async (req, res) => {
    const { role } = req.user;
    if (role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const users = await User.find();
    if (!users || users.length === 0) return res.status(404).json({ message: 'No users found' });

    // Get all user emails
    const userEmails = users.map(user => user.email);

    // Fetch tasks assigned to any of these users
    const tasks = await Task.find({ assignedTo: { $in: userEmails } });

    // Attach assignedTasks to each user
    const usersWithTasks = users.map(user => {
        const assignedTasks = tasks.filter(task =>
            task.assignedTo.toString() === user.email.toString()
        );
        return {
            ...user.toObject(),
            assignedTasks
        };
    });

    return res.status(200).json(usersWithTasks);
};

// Get user by ID (Admin only)
exports.getUserById = async (req, res) => {
    const { role } = req.user;
    if (role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
};
// Update user (Admin only)
exports.updateUser = async (req, res) => {
    const { role } = req.user;
    if (role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const { userId } = req.params;
    const { name, email, password, assignedUsers } = req.body;
    const hashedPassword = password ? bcrypt.hashSync(password, 8) : undefined;

    const updatedUser = await User.findByIdAndUpdate(userId, { name, email, password: hashedPassword, assignedUsers }, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json(updatedUser);
};
// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
    const { role } = req.user;
    if (role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
};
// Get users managed by a manager (Manager only)
exports.getManagedUsers = async (req, res) => {
    try {
        // Only managers and admins can access this route
        if (req.user.role !== 'manager' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        let query = {};

        // If manager, only get users they manage
        if (req.user.role === 'manager') {
            query = { manager: req.user._id };
        }
        // If admin and managerId is provided, get users managed by that manager
        else if (req.query.managerId) {
            query = { manager: req.query.managerId };
        }

        const users = await User.find(query).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch managed users',
            error: error.message
        });
    }
};
//assign user
exports.assignUserToManager = async (req, res) => {
    const { userId, managerId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (user.assigned_manager === managerId) {
            return res.status(400).json({ success: false, message: 'User is already assigned to this manager' });

        }
        const manager = await Manager.findById(managerId);
        if (!manager) {
            return res.status(404).json({ success: false, message: 'Manager not found' });
        }
        // Check if the user is already assigned to another manager
        const existingManager = await User.findOne({ assigned_manager: userId });
        if (existingManager) {
            return res.status(400).json({ success: false, message: 'User is already assigned to another manager' });
        }

        // Check if the manager is already assigned to the user
        const existingUser = await Manager.findOne({ assignedUsers: userId });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Manager is already assigned to this user' });
        }


        // Assign manager to the user
        manager.assignedUsers.push(userId);
        user.assigned_manager = managerId;
        await manager.save(); // Save the manager's assigned users
        await user.save();

        return res.status(200).json({ success: true, message: 'User successfully assigned to manager', user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Admin updates user's manager
exports.updateUserManager = async (req, res) => {
    const { userId, newManagerId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (user.assigned_manager === newManagerId) {
            return res.status(400).json({ success: false, message: 'User is already assigned to this manager' });
        }

        user.assigned_manager = newManagerId;
        await user.save();

        return res.status(200).json({ success: true, message: 'User manager updated successfully', user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get all users assigned to a manager
exports.getAssignedUsers = async (req, res) => {
    const { managerId } = req.query;

    try {
        const users = await User.find({ assignedManager: managerId });
        return res.status(200).json({ success: true, users });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get the assigned manager for the user
exports.getAssignedManager = async (req, res) => {
    const { userId } = req.query;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({ success: true, assignedManager: user.assigned_manager });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
//get all managers by admin
exports.getAllManagers = async (req, res) => {
    try {
        //only admin can get it
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
        // Get all managers
        const managers = await Manager.find().select('-password');
        if (!managers || managers.length === 0) return res.status(404).json({ message: 'No managers found' });
        res.status(200).json(managers);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch managers', error: error.message });
    }
}
exports.updateTaskStatus = async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;
    const { id, role } = req.user;

    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    // Admin can update any task
    if (role === 'admin') {
        task.status = status;
        await task.save();
        return res.status(200).json({ message: 'Status updated by admin', task });
    }

    // Manager can update their own tasks or tasks assigned to their users
    if (role === 'manager') {
        const manager = await Manager.findById(id).populate('assignedUsers');
        const userIds = manager.assignedUsers.map(user => user._id.toString());

        if (
            task.creatorId.toString() === id ||
            userIds.includes(task.creatorId.toString())
        ) {
            task.status = status;
            await task.save();
            return res.status(200).json({ message: 'Status updated by manager', task });
        }

        return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // User can only update if task is assigned to them or his own created ones

    if (role === 'user') {
        const user = await User.findById(id);
        console.log(" task.creatorId", task.creatorId, user._id)
        if (task.assignedTo === user.email || String(task.creatorId) === String(user._id)) {
            task.status = status;
            await task.save();
            return res.status(200).json({ message: 'Status updated by user', task });
        }

        return res.status(403).json({ message: 'You can only update tasks assigned to you' });
    }

    return res.status(403).json({ message: 'Unauthorized role' });
};
