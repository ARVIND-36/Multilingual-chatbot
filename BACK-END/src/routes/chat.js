const express = require('express');
const GeminiChatService = require('../services/GeminiChatService');
const Ticket = require('../models/Ticket');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();
const chatService = new GeminiChatService();

// @route   POST /api/chat/message
// @desc    Process user message with OpenAI and create ticket if valid
// @access  Public
router.post('/message', async (req, res) => {
  try {
    const { message, username = 'Anonymous User' } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
        response: 'தகவல் தேவை. தயவுசெய்து உங்கள் செய்தியை அனுப்பவும்.'
      });
    }

    // Analyze the message with Gemini AI
    console.log('Analyzing message:', message);
    const analysis = await chatService.analyzeMessage(message.trim(), username);
    
    let ticket = null;
    let ticketNumber = null;

    // Create ticket if the analysis suggests it's valid
    if (analysis.createTicket && analysis.isValidComplaint) {
      try {
        ticketNumber = chatService.generateTicketNumber();
        const priority = chatService.determinePriority(analysis.category);

        ticket = new Ticket({
          ticketNumber,
          username: analysis.username || username,
          originalMessage: analysis.originalMessage,
          translation: analysis.translation,
          category: analysis.category,
          priority,
          status: 'open',
          confidence: analysis.confidence,
          reason: analysis.reason,
          aiResponse: analysis.response
        });

        await ticket.save();
        console.log('Ticket created:', ticketNumber);

        // Enhanced response with ticket info
        const ticketResponse = `${analysis.response}\n\n✅ டிக்கெட் உருவாக்கப்பட்டது!\n📋 டிக்கெட் எண்: ${ticketNumber}\n📂 வகை: ${analysis.category}\n⚡ முன்னுரிமை: ${priority.toUpperCase()}`;

        return res.json({
          success: true,
          ticketCreated: true,
          ticketNumber,
          category: analysis.category,
          priority,
          confidence: analysis.confidence,
          translation: analysis.translation,
          reason: analysis.reason,
          response: ticketResponse,
          analysis: analysis,
          ticket: {
            id: ticket._id,
            ticketNumber: ticket.ticketNumber,
            status: ticket.status,
            createdAt: ticket.createdAt
          }
        });

      } catch (ticketError) {
        console.error('Ticket creation failed:', ticketError);
        // Return analysis even if ticket creation fails
        return res.json({
          success: true,
          ticketCreated: false,
          response: `${analysis.response}\n\n⚠️ டிக்கெட் உருவாக்குவதில் சிக்கல் ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.`,
          analysis: analysis,
          error: 'Ticket creation failed'
        });
      }
    }

    // No ticket created - just return the analysis
    return res.json({
      success: true,
      ticketCreated: false,
      category: analysis.category,
      confidence: analysis.confidence,
      translation: analysis.translation,
      reason: analysis.reason,
      response: analysis.response,
      analysis: analysis
    });

  } catch (error) {
    console.error('Chat processing error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Server error while processing message',
      response: 'மன்னிக்கவும், சர்வர் பிழை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.',
      error: error.message
    });
  }
});

// @route   GET /api/chat/tickets/:username
// @desc    Get tickets for a specific username
// @access  Public
router.get('/tickets/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { status, limit = 10 } = req.query;

    const filter = { username };
    if (status) filter.status = status;

    const tickets = await Ticket.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      tickets: tickets.map(ticket => ({
        ticketNumber: ticket.ticketNumber,
        category: ticket.category,
        status: ticket.status,
        priority: ticket.priority,
        originalMessage: ticket.originalMessage,
        translation: ticket.translation,
        createdAt: ticket.createdAt
      }))
    });

  } catch (error) {
    console.error('Tickets fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tickets'
    });
  }
});

// @route   GET /api/chat/ticket/:ticketNumber
// @desc    Get specific ticket details
// @access  Public
router.get('/ticket/:ticketNumber', async (req, res) => {
  try {
    const { ticketNumber } = req.params;

    const ticket = await Ticket.findOne({ ticketNumber });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
        response: 'டிக்கெட் கிடைக்கவில்லை'
      });
    }

    res.json({
      success: true,
      ticket: {
        ticketNumber: ticket.ticketNumber,
        username: ticket.username,
        category: ticket.category,
        status: ticket.status,
        priority: ticket.priority,
        originalMessage: ticket.originalMessage,
        translation: ticket.translation,
        confidence: ticket.confidence,
        reason: ticket.reason,
        aiResponse: ticket.aiResponse,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt
      }
    });

  } catch (error) {
    console.error('Ticket fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ticket'
    });
  }
});

module.exports = router;