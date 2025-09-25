import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaMicrophone, FaStop, FaCog, FaUser, FaRobot, FaCopy, FaDownload, FaLanguage, FaVolumeUp, FaPause, FaEllipsisV, FaTachometerAlt, FaTicketAlt } from 'react-icons/fa';
import { tokenUtils } from '../services/api';

const Chatbot = ({ onLogout, onShowDashboard }) => {
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const optionsMenuRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "வணக்கம்! நான் உங்கள் நகராட்சி புகார் உதவியாளர். தமிழில் உங்கள் புகாரை தெரிவிக்கவும். (Hello! I'm your municipal complaint assistant. Please share your complaint in Tamil.)\n\n📝 Examples:\n• kuppai collection problem\n• thanneer vara villai\n• theru vilakku work seiya villai\n• sadai la hole irukku",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString(),
      language: 'ta'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ta');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);

  const languages = [
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'en', name: 'English', flag: '🇮🇳' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
        setShowOptionsMenu(false);
      }
    };

    if (showOptionsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showOptionsMenu]);

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const userMessage = {
        id: messages.length + 1,
        text: inputMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString(),
        language: selectedLanguage
      };

      setMessages(prev => [...prev, userMessage]);
      const currentInput = inputMessage;
      setInputMessage('');
      setIsTyping(true);

      try {
        // Get username from token or use default
        let username = 'Anonymous User';
        const token = tokenUtils.getToken();
        
        if (token) {
          try {
            const response = await fetch('http://localhost:5000/api/auth/verify', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
              const userData = await response.json();
              username = userData.user?.username || userData.user?.email || username;
            }
          } catch (authError) {
            console.log('Auth check failed, using anonymous:', authError);
          }
        }

        // Send message to OpenAI chat service
        const chatResponse = await fetch('http://localhost:5000/api/chat/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: currentInput,
            username: username
          })
        });

        const result = await chatResponse.json();

        if (result.success) {
          const botMessage = {
            id: messages.length + 2,
            text: result.response,
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString(),
            language: 'ta',
            ticketCreated: result.ticketCreated,
            analysis: result.analysis,
            ticketInfo: result.ticketCreated ? {
              ticketNumber: result.ticketNumber,
              category: result.category,
              priority: result.priority,
              confidence: result.confidence,
              translation: result.translation
            } : null
          };
          setMessages(prev => [...prev, botMessage]);
        } else {
          // Error fallback
          const errorMessage = {
            id: messages.length + 2,
            text: result.response || 'மன்னிக்கவும், ஏதோ பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.',
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString(),
            language: 'ta'
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      } catch (error) {
        console.error('Chat error:', error);
        const errorMessage = {
          id: messages.length + 2,
          text: 'மன்னிக்கவும், சர்வர் இணைப்பில் சிக்கல். தயவுசெய்து மீண்டும் முயற்சிக்கவும்.',
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString(),
          language: 'ta'
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording functionality
  };

  const speakMessage = (text) => {
    setIsSpeaking(true);
    // TODO: Implement text-to-speech
    setTimeout(() => setIsSpeaking(false), 2000);
  };

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    // TODO: Add toast notification
  };

  const exportChat = () => {
    const chatData = messages.map(msg => `${msg.timestamp} - ${msg.sender}: ${msg.text}`).join('\n');
    const blob = new Blob([chatData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat-export.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="chatbot-container">
      {/* Header */}
      <div className="chatbot-header">
        <div className="bot-info">
          <div className="bot-avatar">
            <FaRobot />
          </div>
          <div className="bot-details">
            <h3>Municipal Assistant</h3>
            <span className="status">Online</span>
          </div>
        </div>
        
        <div className="header-controls">
          <div className="language-selector">
            <FaLanguage />
            <select 
              value={selectedLanguage} 
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="language-dropdown"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          <button className="header-btn" onClick={exportChat} title="Export Chat">
            <FaDownload />
          </button>
          
          <button className="header-btn" title="Settings">
            <FaCog />
          </button>
          
          <div className="options-menu-container" ref={optionsMenuRef}>
            <button 
              className="header-btn options-btn" 
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              title="More Options"
            >
              <FaEllipsisV />
            </button>
            
            {showOptionsMenu && (
              <div className="options-dropdown">
                <button 
                  className="dropdown-item" 
                  onClick={() => {
                    setShowOptionsMenu(false);
                    onShowDashboard?.();
                  }}
                >
                  <FaTachometerAlt /> Dashboard
                </button>
                <button 
                  className="dropdown-item" 
                  onClick={() => {
                    setShowOptionsMenu(false);
                    // Future: Open ticket creation modal
                    alert('Ticket creation feature coming soon!');
                  }}
                >
                  <FaTicketAlt /> My Tickets
                </button>
                <button 
                  className="dropdown-item logout-item" 
                  onClick={() => {
                    setShowOptionsMenu(false);
                    onLogout?.();
                  }}
                >
                  <FaUser /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        <div className="messages-wrapper">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-avatar">
                {message.sender === 'user' ? <FaUser /> : <FaRobot />}
              </div>
              
              <div className="message-content">
                <div className="message-bubble">
                  <p>{message.text}</p>
                  
                  {/* Show ticket information if ticket was created */}
                  {message.ticketInfo && (
                    <div className="ticket-info">
                      <div className="ticket-card">
                        <FaTicketAlt className="ticket-icon" />
                        <div className="ticket-details">
                          <strong>Ticket #{message.ticketInfo.ticketNumber}</strong>
                          <span className="ticket-category">{message.ticketInfo.category}</span>
                          <span className={`ticket-priority priority-${message.ticketInfo.priority}`}>
                            {message.ticketInfo.priority?.toUpperCase()}
                          </span>
                          {message.ticketInfo.confidence && (
                            <span className="ticket-confidence">
                              Confidence: {(message.ticketInfo.confidence * 100).toFixed(0)}%
                            </span>
                          )}
                          {message.ticketInfo.translation && (
                            <span className="ticket-translation">
                              English: {message.ticketInfo.translation}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Show analysis info for non-ticket responses */}
                  {message.analysis && !message.ticketCreated && (
                    <div className="analysis-info">
                      <div className="analysis-card">
                        <div className="analysis-header">📊 பகுப்பாய்வு முடிவு</div>
                        <div className="analysis-row">
                          <span className="analysis-label">வகை:</span>
                          <span className="analysis-value">{message.analysis.category}</span>
                        </div>
                        <div className="analysis-row">
                          <span className="analysis-label">நம்பகத்தன்மை:</span>
                          <span className="analysis-value">{(message.analysis.confidence * 100).toFixed(0)}%</span>
                        </div>
                        {message.analysis.translation && (
                          <div className="analysis-row">
                            <span className="analysis-label">English:</span>
                            <span className="analysis-value">{message.analysis.translation}</span>
                          </div>
                        )}
                        <div className="analysis-reason">
                          <span className="reason-label">காரணம்:</span>
                          <span className="reason-text">{message.analysis.reason}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="message-actions">
                    <button 
                      className="action-btn" 
                      onClick={() => copyMessage(message.text)}
                      title="Copy message"
                    >
                      <FaCopy />
                    </button>
                    <button 
                      className="action-btn" 
                      onClick={() => speakMessage(message.text)}
                      title="Read aloud"
                    >
                      {isSpeaking ? <FaPause /> : <FaVolumeUp />}
                    </button>
                  </div>
                </div>
                <div className="message-meta">
                  <span className="timestamp">{message.timestamp}</span>
                  <span className="language-tag">
                    {languages.find(l => l.code === message.language)?.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot">
              <div className="message-avatar">
                <FaRobot />
              </div>
              <div className="message-content">
                <div className="message-bubble typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Container */}
      <div className="input-container">
        <div className="input-wrapper">
          <div className="input-field">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="தமிழில் உங்கள் புகாரை தெரிவிக்கவும்... (Type your complaint in Tamil...)"
              className="message-input"
              rows="1"
            />
            
            <div className="input-actions">
              <button 
                className={`voice-btn ${isRecording ? 'recording' : ''}`}
                onClick={toggleRecording}
                title={isRecording ? 'Stop recording' : 'Voice message'}
              >
                {isRecording ? <FaStop /> : <FaMicrophone />}
              </button>
              
              <button 
                className="send-btn" 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                title="Send message"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
        
        <div className="input-footer">
          <p>Enter ஐ அழுத்தி அனுப்பவும் • Shift+Enter புதிய வரிக்கு</p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;