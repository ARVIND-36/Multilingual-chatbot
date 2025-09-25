import React, { useState, useEffect } from 'react';
import { authAPI, tokenUtils, dashboardAPI } from '../services/api';
import '../clientDashboard.css';

const UserDashboard = ({ onLogout, onBackToChatbot }) => {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

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
      const response = await dashboardAPI.getUserTickets();
      setTickets(response.tickets || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setTickets([]);
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
      <aside className="sidebar-menu">
        <div className="sidebar-logo">
          <div className="logo-placeholder"></div>
          <h2>City Services</h2>
        </div>
        <nav>
          <ul>
            <li className="active"> Dashboard</li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-content">
        <nav className="top-nav">
          <div className="language-selector">
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="English">English</option>
              <option value="Hindi">हनद</option>
              <option value="Tamil">தமழ</option>
            </select>
          </div>
          <div className="user-profile">
            <span> Welcome, {user?.username || 'Citizen'}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </nav>

        <div className="dashboard-grid">
          <div className="stats-section">
            <div className="stat-card total">
              <h3>Total Complaints</h3>
              <p className="stat-number">{tickets.length}</p>
            </div>
            <div className="stat-card pending">
              <h3>Pending</h3>
              <p className="stat-number">{tickets.filter(t => t.status === 'open').length}</p>
            </div>
            <div className="stat-card progress">
              <h3>In Progress</h3>
              <p className="stat-number">{tickets.filter(t => t.status === 'in_progress').length}</p>
            </div>
            <div className="stat-card resolved">
              <h3>Resolved</h3>
              <p className="stat-number">{tickets.filter(t => t.status === 'resolved').length}</p>
            </div>
          </div>

          <div className="complaints-section">
            <h2>My Complaints</h2>
            <div className="complaints-table">
              <table>
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Category</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.length > 0 ? (
                    tickets.map(ticket => (
                      <tr key={ticket._id}>
                        <td>#{ticket.ticketNumber}</td>
                        <td>{ticket.category}</td>
                        <td className="message-cell" title={ticket.originalMessage}>
                          {ticket.originalMessage?.substring(0, 30)}
                          {ticket.originalMessage?.length > 30 ? '...' : ''}
                        </td>
                        <td>
                          <span className={`status ${ticket.status}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td>
                          <span className={`priority ${ticket.priority}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-tickets">
                        No complaints found. Create your first complaint using the chatbot!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="quick-actions">
            <button className="action-btn new-complaint" onClick={handleOpenChatbot}>
               Submit New Complaint
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
