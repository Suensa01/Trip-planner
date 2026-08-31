const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Fetch wrapper attaching JWT Authorization header automatically
 */
async function request(endpoint, options = {}) {
  const token = sessionStorage.getItem('quest_jwt_token') || localStorage.getItem('quest_jwt_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API Request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error.message);
    throw error;
  }
}

export const api = {
  // Auth API
  register: (name, email, password, role) => request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, role }) }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getProfile: () => request('/auth/me'),

  // Trips API
  getTrips: () => request('/trips'),
  createTrip: (tripData) => request('/trips', { method: 'POST', body: JSON.stringify(tripData) }),
  updateTrip: (tripId, data) => request(`/trips/${tripId}`, { method: 'PUT', body: JSON.stringify(data) }),
  addActivity: (tripId, activity) => request(`/trips/${tripId}/activities`, { method: 'POST', body: JSON.stringify(activity) }),
  deleteActivity: (tripId, actId) => request(`/trips/${tripId}/activities/${actId}`, { method: 'DELETE' }),

  // Expenses API
  addExpense: (expenseData) => request('/expenses', { method: 'POST', body: JSON.stringify(expenseData) }),
  deleteExpense: (expenseId) => request(`/expenses/${expenseId}`, { method: 'DELETE' }),

  // Documents API
  addDocument: (docData) => request('/documents', { method: 'POST', body: JSON.stringify(docData) }),

  // Wishlist API
  getWishlist: () => request('/wishlist'),
  toggleWishlist: (item) => request('/wishlist/toggle', { method: 'POST', body: JSON.stringify(item) }),

  // Admin API (RBAC)
  getAdminUsers: () => request('/admin/users'),
  getAdminTrips: () => request('/admin/trips'),
  deleteAdminTrip: (tripId) => request(`/admin/trips/${tripId}`, { method: 'DELETE' }),
  updateUserRole: (userId, role) => request(`/admin/users/${userId}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  deleteUser: (userId) => request(`/admin/users/${userId}`, { method: 'DELETE' }),
  getAdminStats: () => request('/admin/stats')
};

export default api;
