const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

module.exports = (req, res, next) => {
    console.log('Auth middleware triggered');
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Token required' });

    try {
        const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid token' });
    }
};
