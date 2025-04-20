const Task = require('../models/Task');
const User = require('../models/RegularUser');
const Manager = require('../models/Manager');

exports.createTask = async (req, res) => {
    console.log("here");
    const { title, description, dueDate, status, assignedTo } = req.body;
    const { id, role } = req.user;

    let taskData = {
        title,
        description,
        dueDate,
        status,
        creatorId: id,
        creatorModel: role.charAt(0).toUpperCase() + role.slice(1)
    };

    // If the user is an admin and assignedTo is provided, add assignedTo and assignedModel
    if (role === 'admin' && assignedTo) {
        taskData.assignedTo = assignedTo
    }

    // If the user is admin, manager, or user, create the task
    try {
        let task = await Task.create(taskData);
        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Error creating task' });
    }
};



exports.getTasks = async (req, res) => {
    const { id, role } = req.user;
    let tasks;

    if (role === 'admin') {
        tasks = await Task.find();
    } 
    else if (role === 'manager') {
        const manager = await Manager.findById(id).populate('assignedUsers');
        const userIds = manager.assignedUsers.map(u => u._id);
        tasks = await Task.find({ $or: [{ creatorId: id }, { creatorId: { $in: userIds } }] });
    } else if (role === 'user') {
        tasks = await Task.find({ creatorId: id });
    } else {
        return res.status(403).json({ message: 'Forbidden' });
    }

    // Get unique emails for assigned users, skip nulls
    const userEmails = [...new Set(tasks.map(task => task.assignedTo).filter(email => !!email))];

    // Fetch user names based on assignedTo email
    const users = await User.find({ email: { $in: userEmails } });
    const userMap = {};
    users.forEach(user => {
        userMap[user.email] = user.name;
    });

    // Add assignedToName or null
    const tasksWithAssignedUser = tasks.map(task => {
        return {
            ...task._doc,
            assignedToName: task.assignedTo ? userMap[task.assignedTo] || 'Unknown' : null
        };
    });

    res.status(200).json(tasksWithAssignedUser);
};

//get task by id by admin, manager and user
exports.getTaskById = async (req, res) => {
    const { id, role } = req.user;
    const { taskId } = req.params;

    let task;
    if (role === 'admin') {
        task = await Task.findById(taskId);
    } else if (role === 'manager') {
        const manager = await Manager.findById(id).populate('assignedUsers');
        const userIds = manager.assignedUsers.map(u => u._id);
        task = await Task.findOne({ _id: taskId, $or: [{ creatorId: id }, { creatorId: { $in: userIds } }] });
    } else {
        task = await Task.findOne({ _id: taskId, creatorId: id });
    }


    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
}

exports.updateTask = async (req, res) => {
    const { id, role } = req.user;
    console.log("req.params.id", req.params.taskId)
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (role === "admin") {
        Object.assign(task, req.body);
        await task.save();
        return res.json(task);
    }

    if (role === "manager") {
        const manager = await Manager.findById(id).populate("assignedUsers");
        const userIds = manager.assignedUsers.map(u => u._id.toString());
        userIds.push(id);

        if (!userIds.includes(task.creatorId.toString())) {
            return res.status(403).json({ message: "Access denied" });
        }

        Object.assign(task, req.body);
        await task.save();
        return res.json(task);
    }

    if (role === "user" && task.creatorId.toString() !== id) {
        return res.status(403).json({ message: "Access denied" });
    }

    Object.assign(task, req.body);
    await task.save();
    res.json(task);
};
//delete
exports.deleteTask = async (req, res) => {
    const { id, role } = req.user;
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (role === "admin") {
        await task.deleteOne();
        return res.json({ message: "Task deleted" });
    }

    if (role === "manager") {
        const manager = await Manager.findById(id).populate("assignedUsers");
        const userIds = manager.assignedUsers.map(u => u._id.toString());
        userIds.push(id);

        if (!userIds.includes(task.creatorId.toString())) {
            return res.status(403).json({ message: "Access denied" });
        }

        await task.deleteOne();
        return res.json({ message: "Task deleted" });
    }

    if (role === "user" && task.creatorId.toString() !== id) {
        return res.status(403).json({ message: "Access denied" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted" });
};
//filter task by due date and
exports.filterTasks = async (req, res) => {
    console.log("here")
    const { status, dueDate } = req.query;
    const { id, role } = req.user;

    let filter = {};

    if (status) filter.status = status;
    if (dueDate) filter.dueDate = new Date(dueDate);

    if (role === "admin") {
        // No creatorId filter
    } else if (role === "manager") {
        const manager = await Manager.findById(id).populate("assignedUsers");
        const userIds = manager.assignedUsers.map(u => u._id);
        userIds.push(id);
        filter.creatorId = { $in: userIds };
    } else if (role === "user") {
        filter.creatorId = id;
    } else {
        return res.status(403).json({ message: "Forbidden" });
    }

    const tasks = await Task.find(filter);
    if (!tasks || tasks.length === 0) {
        return res.status(404).json({ message: "No tasks found" });
    }
    res.json(tasks);
};

