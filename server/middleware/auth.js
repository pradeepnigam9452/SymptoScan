const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'Invalid token' });
    next();
  } catch (err) {
    // More verbose error response during development to aid debugging.
    console.error('Auth middleware error:', err && err.message ? err.message : err);
    const devDetail = process.env.NODE_ENV === 'production' ? undefined : (err && err.message ? err.message : undefined);
    res.status(401).json({ message: 'Token is not valid', detail: devDetail });
  }
};