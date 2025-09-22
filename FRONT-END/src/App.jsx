import { useState, useEffect } from 'react';
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'signup'
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {currentView === 'login' ? (
        <Login onSwitchToSignup={handleSwitchToSignup} />
      ) : (
        <Signup onSwitchToLogin={handleSwitchToLogin} />
      )}
    </div>
  );
}

export default App;
