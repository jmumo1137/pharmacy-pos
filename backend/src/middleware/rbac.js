// middleware/rbac.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'change_me';

const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const header = req.headers.authorization || '';
      const token = header.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'No token provided' });

      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // contains id, email, roles

      const userRoles = Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles];
      if (allowedRoles.length > 0 && !allowedRoles.some(r => userRoles.includes(r))) {
        return res.status(403).json({ message: 'Access denied' });
      }

      next();
    } catch (err) {
      console.error('rbac error', err);
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};

module.exports = authorize;
