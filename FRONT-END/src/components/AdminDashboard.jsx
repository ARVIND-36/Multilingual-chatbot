import React, { useState, useEffect } from 'react';
import { tokenUtils, dashboardAPI } from '../services/api';
import '../adminDashboard.css';

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

  // Sample tickets for demonstration (will be replaced by real API data)
  const sampleTickets = [
    {
      id: 'TK001',
      ticketId: 'TK001',
      userId: { username: 'john_doe', email: 'john@example.com' },
      category: 'Waste Management',
      status: 'open',
      priority: 'high',
      title: 'Garbage not collected for 3 days',
      description: 'Garbage bins have not been emptied in Ward 12 for the past 3 days.',
      createdAt: '2025-09-22T10:30:00Z'
    },
    {
      id: 'TK002',
      ticketId: 'TK002',
      userId: { username: 'jane_smith', email: 'jane@example.com' },
      category: 'Street Light',
      status: 'in_progress',
      priority: 'medium',
      title: 'Street light not working',
      description: 'Street light on Main Road has been non-functional since last week.',
      createdAt: '2025-09-21T14:15:00Z'
    },
    {
      id: 'TK003',
      ticketId: 'TK003',
      userId: { username: 'bob_wilson', email: 'bob@example.com' },
      category: 'Water Supply',
      status: 'resolved',
      priority: 'low',
      title: 'Low water pressure',
      description: 'Water pressure is very low in Block B apartments.',
      createdAt: '2025-09-20T09:45:00Z'
    }
  ];

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
      // Use sample data when API fails
      setTickets(sampleTickets);
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
      // Update local state for demo purposes
      setTickets(prevTickets => 
        prevTickets.map(ticket => 
          ticket.ticketId === ticketId || ticket.id === ticketId 
            ? { ...ticket, status } 
            : ticket
        )
      );
      alert('Ticket status updated locally (demo mode)');
    }
  };

  const handleLogout = () => {
    tokenUtils.removeToken();
    onLogout?.();
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
    <div className="admin-dashboard-root">
      {/* Left Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <div className="logo-placeholder">🏛️</div>
          <h2>Admin Panel</h2>
          <div className="admin-badge">ADMINISTRATOR</div>
        </div>
        <nav>
          <ul>
            <li className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}>
              📊 Dashboard Overview
            </li>
            <li className={activeTab === 'tickets' ? 'active' : ''} onClick={() => setActiveTab('tickets')}>
              🎫 Manage Tickets ({tickets.length})
            </li>
            <li>👥 User Management</li>
            <li>📈 Reports</li>
            <li>⚙️ System Settings</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        {/* Top Navigation */}
        <nav className="admin-top-nav">
          <div className="admin-title">
            <h1>{activeTab === 'stats' ? 'System Overview' : 'Ticket Management'}</h1>
            <p>Administrative Control Panel</p>
          </div>
          <div className="admin-profile">
            <span>🛡️ Admin Dashboard</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="admin-dashboard-content">
          {activeTab === 'stats' && (
            <div className="stats-section">
              {/* Quick Stats */}
              <div className="admin-stats-grid">
                <div className="stat-card total">
                  <h3>Total Tickets</h3>
                  <p className="stat-number">{stats?.totalTickets || tickets.length}</p>
                </div>
                <div className="stat-card pending">
                  <h3>Open</h3>
                  <p className="stat-number">{stats?.openTickets || tickets.filter(t => t.status === 'open').length}</p>
                </div>
                <div className="stat-card progress">
                  <h3>In Progress</h3>
                  <p className="stat-number">{stats?.inProgressTickets || tickets.filter(t => t.status === 'in_progress').length}</p>
                </div>
                <div className="stat-card resolved">
                  <h3>Resolved</h3>
                  <p className="stat-number">{stats?.resolvedTickets || tickets.filter(t => t.status === 'resolved').length}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="tickets-management-section">
              <div className="tickets-filters">
                <h2>Ticket Management</h2>
                <div className="filter-controls">
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
                </div>
              </div>

              <div className="admin-tickets-table">
                <table>
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>User</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="no-tickets">No tickets found</td>
                      </tr>
                    ) : (
                      tickets.map(ticket => (
                        <tr key={ticket._id || ticket.id}>
                          <td>#{ticket.ticketId || ticket.id}</td>
                          <td>{ticket.userId?.username || ticket.user || 'Unknown'}</td>
                          <td>{ticket.category || 'General'}</td>
                          <td>
                            <span className={`status ${ticket.status}`}>
                              {ticket.status}
                            </span>
                          </td>
                          <td>
                            <span className={`priority ${ticket.priority || 'medium'}`}>
                              {ticket.priority || 'medium'}
                            </span>
                          </td>
                          <td>{new Date(ticket.createdAt || Date.now()).toLocaleDateString()}</td>
                          <td className="action-buttons">
                            {ticket.status === 'open' && (
                              <button 
                                onClick={() => updateTicketStatus(ticket.ticketId || ticket.id, 'in_progress')}
                                className="action-btn progress-btn"
                                title="Start Progress"
                              >
                                ▶️
                              </button>
                            )}
                            {ticket.status === 'in_progress' && (
                              <button 
                                onClick={() => updateTicketStatus(ticket.ticketId || ticket.id, 'resolved')}
                                className="action-btn resolve-btn"
                                title="Mark Resolved"
                              >
                                ✅
                              </button>
                            )}
                            {ticket.status === 'resolved' && (
                              <button 
                                onClick={() => updateTicketStatus(ticket.ticketId || ticket.id, 'closed')}
                                className="action-btn close-btn"
                                title="Close Ticket"
                              >
                                🔒
                              </button>
                            )}
                            <button className="view-btn" title="View Details">👁️</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;