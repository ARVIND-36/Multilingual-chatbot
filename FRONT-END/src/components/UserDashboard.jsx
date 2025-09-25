import React, { useState, useEffect } from 'react';
import { authAPI, tokenUtils, dashboardAPI } from '../services/api';
import '../clientDashboard.css';

const UserDashboard = ({ onLogout, onBackToChatbot }) => {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  // Sample complaints data - replace with actual API calls later
  const complaints = [
    {
      id: 'WM4523',
      category: 'Waste Management',
      description: 'Garbage not collected',
      date: '20 Sep 2025',
      status: 'pending',
      location: 'Ward 12, Street 7'
    },
    {
      id: 'ST3210',
      category: 'Street Light',
      description: 'Light not working since 2 days',
      date: '19 Sep 2025',
      status: 'progress',
      location: 'Ward 5, Main Road'
    },
    {
      id: 'WS1987',
      category: 'Water Supply',
      description: 'Low water pressure',
      date: '18 Sep 2025',
      status: 'resolved',
      location: 'Ward 8, Block B'
    }
  ];

  useEffect(() => {
    fetchUserData();
    fetchTickets();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await dashboardAPI.getUserProfile();
      setUser(response.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchTickets = async () => {
    try {
      const token = tokenUtils.getToken();
      if (token) {
        // Get user ID first
        const userResponse = await fetch('http://localhost:5000/api/auth/verify', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          const userId = userData.user?.id;
          
          // Fetch user tickets
          const ticketsResponse = await fetch(`http://localhost:5000/api/complaints/user/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (ticketsResponse.ok) {
            const ticketsData = await ticketsResponse.json();
            setTickets(ticketsData.tickets || []);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      // Keep sample data if API fails
      setTickets(sampleTickets);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    tokenUtils.removeToken();
    onLogout?.();
  };

  const handleOpenChatbot = () => {
    onBackToChatbot?.();
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': '#27ae60',
      'medium': '#f39c12',
      'high': '#e74c3c',
      'urgent': '#8e44ad'
    };
    return colors[priority] || '#95a5a6';
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-root">
      {/* Left Sidebar */}
      <aside className="sidebar-menu">
        <div className="sidebar-logo">
          <div className="logo-placeholder">🏛️</div>
          <h2>City Services</h2>
        </div>
        <nav>
          <ul>
            <li className="active">📊 Dashboard</li>
            <li> My Complaints</li>
          </ul>
        </nav>
        <div className="chatbot-quick-access">
          <h3>Quick Help</h3>
          <button className="chat-button" onClick={handleOpenChatbot}>
            💬 Open Chatbot Assistant
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Top Navigation */}
        <nav className="top-nav">
          <div className="language-selector">
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="English">English</option>
              <option value="Hindi">हिन्दी</option>
              <option value="Tamil">தமிழ்</option>
            </select>
          </div>
          <div className="user-profile">
            <span>👤 Welcome, {user?.username || 'Citizen'}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </nav>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Quick Stats */}
          <div className="stats-section">
            <div className="stat-card total">
              <h3>Total Complaints</h3>
              <p className="stat-number">{tickets.length || 12}</p>
            </div>
            <div className="stat-card pending">
              <h3>Pending</h3>
              <p className="stat-number">{tickets.filter(t => t.status === 'open').length || 3}</p>
            </div>
            <div className="stat-card progress">
              <h3>In Progress</h3>
              <p className="stat-number">{tickets.filter(t => t.status === 'in_progress').length || 4}</p>
            </div>
            <div className="stat-card resolved">
              <h3>Resolved</h3>
              <p className="stat-number">{tickets.filter(t => t.status === 'resolved').length || 5}</p>
            </div>
          </div>

          {/* Recent Complaints */}
          <div className="complaints-section">
            <h2>Recent Complaints</h2>
            <div className="complaints-table">
              <table>
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(tickets.length > 0 ? tickets : complaints).map(complaint => (
                    <tr key={complaint.id || complaint._id}>
                      <td>#{complaint.ticketId || complaint.id}</td>
                      <td>{complaint.category}</td>
                      <td>{complaint.location || 'Not specified'}</td>
                      <td>
                        <span className={`status ${complaint.status}`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td>
                        <span className="ticket-id">#{complaint.ticketId || complaint.id}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button className="action-btn new-complaint" onClick={handleOpenChatbot}>
              � Submit New Complaint
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;