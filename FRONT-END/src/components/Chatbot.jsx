import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaMicrophone, FaStop, FaCog, FaUser, FaRobot, FaCopy, FaDownload, FaLanguage, FaVolumeUp, FaPause, FaEllipsisV, FaTachometerAlt, FaTicketAlt } from 'react-icons/fa';
import { tokenUtils } from '../services/api';

const Chatbot = ({ onLogout, onShowDashboard }) => {
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const optionsMenuRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your multilingual assistant. I can help you communicate in various Indian languages. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString(),
      language: 'en'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇮🇳' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
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

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const userMessage = {
        id: messages.length + 1,
        text: inputMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString(),
        language: selectedLanguage
      };

      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      setIsTyping(true);

      // Simulate bot response
      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          text: `I understand you said: "${inputMessage}". This is a simulated response in ${languages.find(l => l.code === selectedLanguage)?.name}. In a real implementation, this would be processed by your multilingual AI model.`,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString(),
          language: selectedLanguage
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1500);
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
    const chatData = messages.map(msg => 
      `[${msg.timestamp}] ${msg.sender === 'user' ? 'You' : 'Assistant'}: ${msg.text}`
    ).join('\n');
    
    const blob = new Blob([chatData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toDateString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="chatbot-container">
      {/* Header */}
      <div className="chatbot-header">
        <div className="header-left">
          <div className="bot-avatar">
            <FaRobot />
          </div>
          <div className="bot-info">
            <h3>Multilingual Assistant</h3>
            <span className="status">Online • Ready to help</span>
          </div>
        </div>
        
        <div className="header-right">
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
              placeholder={`Type your message in ${languages.find(l => l.code === selectedLanguage)?.name}...`}
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
          <p>Press Enter to send • Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;