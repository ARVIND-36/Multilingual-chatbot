const axios = require('axios');

class GeminiChatService {
  constructor() {
    // Use environment variable or fallback to provided key
    this.apiKey = process.env.GEMINI_API_KEY || 'AIzaSyBkx4ggWoTryq8B5dYheccw33QjTN1g3-8';
    this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`;
    
    // Municipal complaint categories
    this.categories = [
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
    ];
    
    console.log('Gemini Service initialized with API key length:', this.apiKey.length);
  }

  async analyzeMessage(userMessage, username = null) {
    try {
      console.log('Analyzing message with Gemini:', userMessage);
      
      const prompt = `You are a Tamil municipal complaint analyzer. Analyze this message which could be in Tamil script or Tamil words written in English characters (transliteration). Respond ONLY with valid JSON.

Message: "${userMessage}"

Categories available: ${this.categories.join(', ')}

The message could be:
- Pure Tamil script: எங்கள் பகுதியில் குப்பை எடுக்கப்படவில்லை
- Tamil in English: engal paguthiyil kuppai edukkappada villai
- Mixed: garbage edukkappa villai
- English: garbage not collected

Common Tamil words in English:
- kuppai = garbage/waste
- thanneer = water  
- theruvil = in street
- paguthi/area = area
- edukkappa = collected
- villai = not
- problem = prachana
- street light = theru vilakku
- road = sadai
- ward = வார்டு

Location indicators:
- ward number: ward 1, ward 2, वार्ड 1, வார்டு 1
- area names: anna nagar, t nagar, etc
- street names: 1st street, 2nd cross, etc

Analyze if this is a valid municipal complaint about:
- Water supply issues (thanneer prachana)
- Waste/garbage collection (kuppai collection)
- Street lights (theru vilakku)
- Road problems (sadai prachana)
- Traffic issues (traffic problem)
- Public health (health prachana)
- Other municipal services

For the message "${userMessage}", determine:
1. Is it a valid municipal complaint requiring action?
2. What category does it belong to?
3. Does it contain location information (ward number, area name, street)?
4. Should a ticket be created?

Rules:
- createTicket = true ONLY for clear, actionable municipal issues WITH location information
- needsLocation = true if complaint is valid but missing location/ward number
- createTicket = false for greetings, questions, unclear messages, or missing location
- Be conservative: when in doubt, set createTicket = false

Response format (JSON only, no markdown, no explanations):
{
  "isValidComplaint": true,
  "category": "Waste Management",
  "hasLocation": false,
  "needsLocation": true,
  "createTicket": false,
  "confidence": 0.9,
  "translation": "Garbage is not being collected in our area",
  "reason": "Valid complaint but needs location information",
  "response": "உங்கள் புகார் புரிந்துகொள்ளப்பட்டது. தயவுசெய்து உங்கள் வார்டு எண் அல்லது பகுதியின் பெயரைத் தெரிவிக்கவும்."
}`;

      console.log('Sending request to Gemini...');
      
      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 400,
        }
      };

      const response = await axios.post(this.apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 20000
      });

      console.log('Gemini Response received:', JSON.stringify(response.data, null, 2));

      // Parse the Gemini response
      const candidates = response.data.candidates;
      if (!candidates || candidates.length === 0) {
        throw new Error('No candidates in Gemini response');
      }

      let content = candidates[0].content.parts[0].text.trim();
      console.log('Raw content:', content);
      
      // Clean up the response - remove any markdown or extra text
      content = content.replace(/```json/g, '').replace(/```/g, '').trim();
      
      // Extract JSON from response
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}');
      
      if (jsonStart === -1 || jsonEnd === -1) {
        console.error('No JSON found in response:', content);
        throw new Error('Invalid JSON response from Gemini');
      }
      
      content = content.substring(jsonStart, jsonEnd + 1);
      console.log('Extracted JSON:', content);
      
      const analysis = JSON.parse(content);
      console.log('Parsed analysis:', analysis);

      // Validate and normalize the response
      const result = {
        isValidComplaint: Boolean(analysis.isValidComplaint),
        category: this.normalizeCategory(analysis.category),
        hasLocation: Boolean(analysis.hasLocation),
        needsLocation: Boolean(analysis.needsLocation),
        createTicket: Boolean(analysis.createTicket),
        confidence: typeof analysis.confidence === 'number' ? Math.min(Math.max(analysis.confidence, 0), 1) : 0.5,
        translation: analysis.translation || userMessage,
        reason: analysis.reason || 'Analysis completed',
        response: analysis.response || 'உங்கள் செய்தி பெறப்பட்டது. பகுப்பாய்வு செய்யப்படுகிறது.',
        originalMessage: userMessage,
        username: username
      };
      
      console.log('Final result:', result);
      return result;

    } catch (error) {
      console.error('Gemini Analysis Error Details:');
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Check if it's an API key error
      if (error.response?.status === 403 || error.response?.status === 401) {
        return {
          isValidComplaint: false,
          category: 'General',
          createTicket: false,
          confidence: 0.1,
          translation: userMessage,
          reason: 'API authentication failed',
          response: 'மன்னிக்கவும், சேவையில் பிரச்சனை. நிர்வாகியை தொடர்பு கொள்ளவும்.',
          originalMessage: userMessage,
          username: username,
          error: 'API Key Invalid'
        };
      }
      
      // General fallback response
      return {
        isValidComplaint: false,
        category: 'General',
        createTicket: false,
        confidence: 0.1,
        translation: userMessage,
        reason: 'Technical error occurred during analysis',
        response: 'மன்னிக்கவும், தொழில்நுட்ப பிரச்சனை ஏற்பட்டுள்ளது. மீண்டும் முயற்சிக்கவும்.',
        originalMessage: userMessage,
        username: username,
        error: error.message
      };
    }
  }

  normalizeCategory(category) {
    if (!category) return 'General';
    
    const cleaned = category.toString().trim();
    const exactMatch = this.categories.find(cat => 
      cat.toLowerCase() === cleaned.toLowerCase()
    );
    
    if (exactMatch) return exactMatch;
    
    // Partial match
    const partialMatch = this.categories.find(cat => 
      cleaned.toLowerCase().includes(cat.toLowerCase()) ||
      cat.toLowerCase().includes(cleaned.toLowerCase())
    );
    
    return partialMatch || 'General';
  }

  generateTicketNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `MCB-${timestamp}-${random}`;
  }

  determinePriority(category) {
    const priorityMap = {
      'Public Health': 'high',
      'Water Supply': 'high', 
      'Road Maintenance': 'medium',
      'Street Light': 'medium',
      'Waste Management': 'medium',
      'Traffic Management': 'low',
      'Noise Pollution': 'low',
      'Property Tax': 'low',
      'Birth/Death Certificate': 'low',
      'General': 'low'
    };
    
    return priorityMap[category] || 'low';
  }
}

module.exports = GeminiChatService;