import React, { useState, useEffect } from 'react';
import { tokenUtils, dashboardAPI } from '../services/api';
import '../dashboard.css';

const AdminDashboard = ({ onLogout, onBackToChatbot }) => {
  const [stats, setStats] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: ''
  });

  useEffect(() => {
    fetchStats();
    fetchTickets();
  }, [filters]);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getAdminStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchTickets = async () => {
    try {
      const response = await dashboardAPI.getAdminTickets(filters);
      setTickets(response.tickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId, status, adminNotes = '') => {
    try {
      await dashboardAPI.updateTicket(ticketId, { status, adminNotes });
      fetchTickets(); // Refresh tickets
      alert('Ticket updated successfully!');
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('Failed to update ticket');
    }
  };

  const handleLogout = () => {
    tokenUtils.removeToken();
    onLogout();
  };

  const getStatusColor = (status) => {
    const colors = {
      'open': '#f39c12',
      'in_progress': '#3498db',
      'resolved': '#27ae60',
      'closed': '#95a5a6'
    };
    return colors[status] || '#95a5a6';
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
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="dashboard-actions">
          <span className="admin-badge">ADMIN</span>
          <button onClick={onBackToChatbot} className="back-btn">
            ← Back to Chat
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tickets' ? 'active' : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          All Tickets ({tickets.length})
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'stats' && stats && (
          <div className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <div className="stat-number">{stats.totalUsers}</div>
              </div>
              <div className="stat-card">
                <h3>Total Tickets</h3>
                <div className="stat-number">{stats.totalTickets}</div>
              </div>
              <div className="stat-card">
                <h3>Open Tickets</h3>
                <div className="stat-number urgent">{stats.openTickets}</div>
              </div>
              <div className="stat-card">
                <h3>Resolved Tickets</h3>
                <div className="stat-number success">{stats.resolvedTickets}</div>
              </div>
              <div className="stat-card">
                <h3>Urgent Tickets</h3>
                <div className="stat-number urgent">{stats.urgentTickets}</div>
              </div>
            </div>

            <div className="charts-section">
              <div className="chart-card">
                <h3>Tickets by Status</h3>
                <div className="chart-list">
                  {stats.ticketsByStatus.map(item => (
                    <div key={item._id} className="chart-item">
                      <span className="chart-label">{item._id?.toUpperCase() || 'Unknown'}</span>
                      <span className="chart-value">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-card">
                <h3>Tickets by Category</h3>
                <div className="chart-list">
                  {stats.ticketsByCategory.map(item => (
                    <div key={item._id} className="chart-item">
                      <span className="chart-label">{item._id?.toUpperCase() || 'Unknown'}</span>
                      <span className="chart-value">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="tickets-section">
            <div className="tickets-filters">
              <select 
                value={filters.status} 
                onChange={e => setFilters({...filters, status: e.target.value})}
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <select 
                value={filters.priority} 
                onChange={e => setFilters({...filters, priority: e.target.value})}
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>

              <select 
                value={filters.category} 
                onChange={e => setFilters({...filters, category: e.target.value})}
              >
                <option value="">All Categories</option>
                <option value="technical">Technical</option>
                <option value="billing">Billing</option>
                <option value="general">General</option>
                <option value="feature_request">Feature Request</option>
                <option value="bug_report">Bug Report</option>
              </select>
            </div>

            {tickets.length === 0 ? (
              <div className="no-tickets">
                <p>No tickets found with current filters.</p>
              </div>
            ) : (
              <div className="admin-tickets-list">
                {tickets.map(ticket => (
                  <div key={ticket._id} className="admin-ticket-card">
                    <div className="ticket-header">
                      <div className="ticket-info">
                        <div className="ticket-id">#{ticket.ticketId}</div>
                        <div className="ticket-user">
                          by {ticket.userId.username} ({ticket.userId.email})
                        </div>
                      </div>
                      <div className="ticket-meta">
                        <span 
                          className="status-badge" 
                          style={{ backgroundColor: getStatusColor(ticket.status) }}
                        >
                          {ticket.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span 
                          className="priority-badge"
                          style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                        >
                          {ticket.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="ticket-content">
                      <h3>{ticket.title}</h3>
                      <p>{ticket.description}</p>
                      
                      {ticket.adminNotes && (
                        <div className="admin-notes">
                          <strong>Admin Notes:</strong> {ticket.adminNotes}
                        </div>
                      )}
                    </div>

                    <div className="ticket-actions">
                      <div className="ticket-footer">
                        <span className="ticket-category">{ticket.category}</span>
                        <span className="ticket-date">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="action-buttons">
                        {ticket.status === 'open' && (
                          <button 
                            onClick={() => updateTicketStatus(ticket.ticketId, 'in_progress')}
                            className="action-btn progress-btn"
                          >
                            Start Progress
                          </button>
                        )}
                        {ticket.status === 'in_progress' && (
                          <button 
                            onClick={() => updateTicketStatus(ticket.ticketId, 'resolved')}
                            className="action-btn resolve-btn"
                          >
                            Mark Resolved
                          </button>
                        )}
                        {ticket.status === 'resolved' && (
                          <button 
                            onClick={() => updateTicketStatus(ticket.ticketId, 'closed')}
                            className="action-btn close-btn"
                          >
                            Close Ticket
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;