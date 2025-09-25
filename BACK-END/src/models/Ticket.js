const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  originalMessage: {
    type: String,
    required: true,
    trim: true
  },
  translation: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: [
      'Water Supply',
      'Waste Management', 
      'Street Light',
      'Road Maintenance',
      'Traffic Management',
      'Noise Pollution',
      'Public Health',
      'Property Tax',
      'Birth/Death Certificate',
      'General'
    ],
    default: 'General'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.5
  },
  reason: {
    type: String,
    trim: true
  },
  aiResponse: {
    type: String,
    required: true
  },
  adminNotes: {
    type: String,
    trim: true
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for better query performance
ticketSchema.index({ ticketNumber: 1 }, { unique: true });
ticketSchema.index({ username: 1 });
ticketSchema.index({ status: 1 });
ticketSchema.index({ category: 1 });
ticketSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Ticket', ticketSchema);