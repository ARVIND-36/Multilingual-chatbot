const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Secret (should match the one in auth.js)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }

    // Add user to request object
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role || 'user'
    };
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

// Middleware to verify admin role
const verifyAdmin = async (req, res, next) => {
  try {
    // First verify the token
    await verifyToken(req, res, () => {
      // Check if user has admin role
      if (req.user && req.user.role === 'admin') {
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }
    });
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(403).json({
      success: false,
      message: 'Admin access denied'
    });
  }
};

// Middleware to verify user owns resource or is admin
const verifyOwnerOrAdmin = (resourceUserField = 'userId') => {
  return async (req, res, next) => {
    try {
      // First verify the token
      await verifyToken(req, res, () => {
        const resourceUserId = req.params[resourceUserField] || req.body[resourceUserField];
        
        // Allow if user is admin or owns the resource
        if (req.user && (req.user.role === 'admin' || req.user.id === resourceUserId)) {
          next();
        } else {
          return res.status(403).json({
            success: false,
            message: 'Access denied - insufficient permissions'
          });
        }
      });
    } catch (error) {
      console.error('Owner/Admin verification error:', error);
      res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
  };
};

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyOwnerOrAdmin
};