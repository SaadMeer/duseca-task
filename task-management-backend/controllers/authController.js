const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Manager = require('../models/Manager');
const User = require('../models/RegularUser');
const { JWT_SECRET } = require('../config');

const getModelByRole = (role) => {
    switch (role) {
        case 'admin': return Admin;
        case 'manager': return Manager;
        case 'user': return User;
        default: return null;
    }
};

exports.login = async (req, res) => {
    const { email, password, role } = req.body;
    const Model = getModelByRole(role);
    if (!Model) return res.status(400).json({ message: 'Invalid role' });

    const user = await Model.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role, name: user.name });
};
