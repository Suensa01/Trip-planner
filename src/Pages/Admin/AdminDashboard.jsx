import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import api from '../../services/api';
import { useToast } from '../../Context/ToastContext';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 1, totalTrips: 1, totalActivities: 8, totalExpenses: 1865 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const loadAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      const [usersRes, statsRes] = await Promise.all([
        api.getAdminUsers().catch(() => null),
        api.getAdminStats().catch(() => null)
      ]);

      if (usersRes?.users) setUsers(usersRes.users);
      if (statsRes?.stats) setStats(statsRes.stats);
    } catch (err) {
      setError('Failed to fetch live admin data from backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'TRAVELER' : 'ADMIN';
    try {
      await api.updateUserRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      showToast('Role Updated!', `Changed user role to ${newRole}.`, 'success', 'bi-shield-lock-fill');
    } catch (err) {
      showToast('Action Failed', err.message || 'Could not update role', 'danger', 'bi-exclamation-triangle-fill');
    }
  };

  const handleDeleteUser = async (userId, email) => {
    if (window.confirm(`Are you sure you want to delete user ${email}?`)) {
      try {
        await api.deleteUser(userId);
        setUsers(users.filter(u => u.id !== userId));
        showToast('User Deleted', `Removed account ${email}.`, 'danger', 'bi-trash-fill');
      } catch (err) {
        showToast('Delete Failed', err.message || 'Could not delete user', 'danger', 'bi-exclamation-triangle-fill');
      }
    }
  };

  return (
    <div className="admin-dashboard-page pb-5 text-start" style={{ paddingTop: '90px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Container>
        {/* Admin Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 bg-dark text-white p-4 rounded-4 shadow">
          <div>
            <Badge bg="danger" className="mb-2 px-3 py-1 fs-6">
              <i className="bi bi-shield-fill-check me-1"></i>ADMIN PORTAL
            </Badge>
            <h2 className="fw-bold mb-1">Platform Control Center & Security Audit</h2>
            <p className="mb-0 text-light opacity-75 small">Manage user roles, platform trips, access permissions, and analytics.</p>
          </div>
          <Button variant="outline-light" onClick={loadAdminData} className="mt-3 mt-md-0 fw-bold">
            <i className="bi bi-arrow-clockwise me-1"></i>Refresh Analytics
          </Button>
        </div>

        {error && <Alert variant="warning" className="mb-4">{error}</Alert>}

        {/* Platform Stat Cards */}
        <Row className="g-4 mb-4">
          <Col md={3}>
            <Card className="shadow-sm border-0 rounded-4 text-start p-3 bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="small opacity-75 fw-bold text-uppercase">Total Users</span>
                  <h2 className="display-6 fw-bold mb-0">{stats.totalUsers}</h2>
                </div>
                <i className="bi bi-people-fill display-5 opacity-50"></i>
              </div>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="shadow-sm border-0 rounded-4 text-start p-3 bg-success text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="small opacity-75 fw-bold text-uppercase">Active Trips</span>
                  <h2 className="display-6 fw-bold mb-0">{stats.totalTrips}</h2>
                </div>
                <i className="bi bi-map-fill display-5 opacity-50"></i>
              </div>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="shadow-sm border-0 rounded-4 text-start p-3 bg-info text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="small opacity-75 fw-bold text-uppercase">Activities</span>
                  <h2 className="display-6 fw-bold mb-0">{stats.totalActivities}</h2>
                </div>
                <i className="bi bi-calendar-check-fill display-5 opacity-50"></i>
              </div>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="shadow-sm border-0 rounded-4 text-start p-3 bg-danger text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="small opacity-75 fw-bold text-uppercase">Expense Volume</span>
                  <h2 className="display-6 fw-bold mb-0">${stats.totalExpenses}</h2>
                </div>
                <i className="bi bi-cash-stack display-5 opacity-50"></i>
              </div>
            </Card>
          </Col>
        </Row>

        {/* User Role Management Table */}
        <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
          <Card.Header className="bg-white p-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0 text-dark">
              <i className="bi bi-person-badge-fill text-danger me-2"></i>User Directory & Access Roles (RBAC)
            </h5>
            <Badge bg="secondary" className="px-3 py-2">{users.length} Users Listed</Badge>
          </Card.Header>
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="danger" />
                <p className="small text-muted mt-2">Loading user directory from server...</p>
              </div>
            ) : (
              <Table responsive hover className="mb-0 align-middle">
                <thead className="table-light small text-uppercase">
                  <tr>
                    <th className="ps-4">User</th>
                    <th>Email</th>
                    <th>Access Role</th>
                    <th>Joined</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-2">
                          <img src={u.avatar || 'https://ui-avatars.com/api/?name=User'} alt={u.name} className="rounded-circle" style={{ width: '36px', height: '36px' }} />
                          <strong className="text-dark">{u.name}</strong>
                        </div>
                      </td>
                      <td className="text-secondary small">{u.email}</td>
                      <td>
                        <Badge bg={u.role === 'ADMIN' ? 'danger' : 'success'} className="px-3 py-1">
                          {u.role || 'TRAVELER'}
                        </Badge>
                      </td>
                      <td className="text-muted small">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent'}</td>
                      <td className="text-end pe-4">
                        <Button 
                          variant={u.role === 'ADMIN' ? 'outline-secondary' : 'outline-danger'} 
                          size="sm" 
                          className="me-2 fw-bold"
                          onClick={() => handleToggleRole(u.id, u.role)}
                        >
                          Make {u.role === 'ADMIN' ? 'Traveler' : 'Admin'}
                        </Button>
                        <Button 
                          variant="link" 
                          className="text-danger p-0 ms-2"
                          onClick={() => handleDeleteUser(u.id, u.email)}
                          title="Delete User"
                        >
                          <i className="bi bi-trash-fill fs-6"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {!users.length && (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        No registered users found in backend database yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default AdminDashboard;
