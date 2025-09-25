const express = require('express');
const cors = require('cors');
const GeminiChatService = require('./src/services/GeminiChatService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route for Gemini without database
app.post('/test-gemini', async (req, res) => {
  try {
    const { message } = req.body;
    console.log('Testing Gemini with message:', message);
    
    const chatService = new GeminiChatService();
    const result = await chatService.analyzeMessage(message, 'TestUser');
    
    res.json({
      success: true,
      analysis: result
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});