const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    dueDate: Date,
    assignedTo: { type: String },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    creatorId: { type: mongoose.Schema.Types.ObjectId, refPath: 'creatorModel' },
    creatorModel: { type: String, enum: ['Admin', 'Manager', 'User'] }
});

module.exports = mongoose.model('Task', taskSchema);
