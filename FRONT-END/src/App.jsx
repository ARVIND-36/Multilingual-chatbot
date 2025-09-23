import { useState, useEffect } from 'react';
import Login from "./components/Login";
import Signup from "./components/Signup";
import Chatbot from "./components/Chatbot";

function App() {
  const [currentView, setCurrentView] = useState('chatbot'); // 'login', 'signup', 'chatbot'
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Allow direct chat view in dev or when VITE_SHOW_CHAT=true
  const showChatDirect = import.meta.env.VITE_SHOW_CHAT === 'true' || import.meta.env.DEV;

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSwitchToSignup = () => {
    setCurrentView('signup');
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentView('chatbot');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Multilingual Assistant...</p>
      </div>
    );
  }

  // Show Chatbot if authenticated OR dev toggle is on
  if ((isAuthenticated || showChatDirect) && currentView === 'chatbot') {
    return <Chatbot onLogout={handleLogout} />;
  }

  return (
    <div className="app-container">
      {currentView === 'login' ? (
        <Login 
          onSwitchToSignup={handleSwitchToSignup} 
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <Signup 
          onSwitchToLogin={handleSwitchToLogin}
          onSignupSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;
