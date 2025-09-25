const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Ticket = require('../models/Ticket');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

// @route   GET /api/dashboard/user/profile
// @desc    Get user profile
// @access  Private
router.get('/user/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        aadhar_no: req.user.aadhar_no,
        role: req.user.role,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/dashboard/user/tickets
// @desc    Get user's tickets
// @access  Private
router.get('/user/tickets', authenticateToken, async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('resolvedBy', 'username');

    res.json({
      success: true,
      tickets: tickets
    });
  } catch (error) {
    console.error('Tickets fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/dashboard/admin/tickets
// @desc    Get all tickets (admin only)
// @access  Private/Admin
router.get('/admin/tickets', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, priority, category } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    const tickets = await Ticket.find(filter)
      .sort({ createdAt: -1 })
      .populate('userId', 'username email')
      .populate('resolvedBy', 'username');

    res.json({
      success: true,
      tickets: tickets
    });
  } catch (error) {
    console.error('Admin tickets fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/dashboard/admin/stats
// @desc    Get dashboard statistics (admin only)
// @access  Private/Admin
router.get('/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'resolved' });
    const urgentTickets = await Ticket.countDocuments({ priority: 'urgent' });

    const ticketsByCategory = await Ticket.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const ticketsByStatus = await Ticket.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalTickets,
        openTickets,
        resolvedTickets,
        urgentTickets,
        ticketsByCategory,
        ticketsByStatus
      }
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/dashboard/admin/tickets/:ticketId
// @desc    Update ticket status (admin only)
// @access  Private/Admin
router.put('/admin/tickets/:ticketId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, adminNotes, priority } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (adminNotes) updateData.adminNotes = adminNotes;
    if (priority) updateData.priority = priority;

    if (status === 'resolved') {
      updateData.resolvedBy = req.user._id;
      updateData.resolvedAt = new Date();
    }

    const ticket = await Ticket.findOneAndUpdate(
      { ticketId: req.params.ticketId },
      updateData,
      { new: true }
    ).populate('userId', 'username email').populate('resolvedBy', 'username');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.json({
      success: true,
      message: 'Ticket updated successfully',
      ticket: ticket
    });
  } catch (error) {
    console.error('Ticket update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;