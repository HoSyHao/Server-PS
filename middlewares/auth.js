const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  try {
    if (!req.cookies) {
      console.error('Cookies not found in request');
      return res.status(401).json({ status: false, message: 'No cookies provided' });
    }

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ status: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found' });
    }

    req.user = { userId: user._id, email: user.email };
    next();
  } catch (error) {
    return res.status(401).json({ status: false, message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;