import { useState, useEffect } from 'react';
import Login from "./components/Login";
import Signup from "./components/Signup";
import Chatbot from "./components/Chatbot";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import { tokenUtils } from './services/api';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('user');

  useEffect(() => {
    // Check if user is already authenticated on app load
    const token = tokenUtils.getToken();
    if (token) {
      // Verify token with backend
      const verifyToken = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setIsAuthenticated(true);
            setUserRole(userData.role || 'user');
            setCurrentView('chatbot');
          } else {
            tokenUtils.removeToken();
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          tokenUtils.removeToken();
        }
      };
      
      verifyToken();
    }
    
    setIsLoading(false);
  }, []);

  const handleSwitchToSignup = () => {
    setCurrentView('signup');
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setUserRole(user?.role || 'user');
    setCurrentView('chatbot');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('user');
    tokenUtils.removeToken();
    setCurrentView('login');
  };

  const handleShowDashboard = () => {
    if (userRole === 'admin') {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('user-dashboard');
    }
  };

  const handleBackToChatbot = () => {
    setCurrentView('chatbot');
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Multilingual Assistant...</p>
      </div>
    );
  }

  // Show different views based on authentication and current view
  if (isAuthenticated) {
    switch (currentView) {
      case 'chatbot':
        return <Chatbot onLogout={handleLogout} onShowDashboard={handleShowDashboard} />;
      case 'user-dashboard':
        return <UserDashboard onLogout={handleLogout} onBackToChatbot={handleBackToChatbot} />;
      case 'admin-dashboard':
        return <AdminDashboard onLogout={handleLogout} onBackToChatbot={handleBackToChatbot} />;
      default:
        return <Chatbot onLogout={handleLogout} onShowDashboard={handleShowDashboard} />;
    }
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
