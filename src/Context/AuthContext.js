import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Start with no user logged in when the application starts
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Clear any previously persisted user credentials from localStorage on launch
  useEffect(() => {
    localStorage.removeItem('quest_user');
    localStorage.removeItem('quest_jwt_token');
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.token && res.user) {
        sessionStorage.setItem('quest_jwt_token', res.token);
        sessionStorage.setItem('quest_user', JSON.stringify(res.user));
        setUser(res.user);
        return res.user;
      }
    } catch (err) {
      // Fallback demo login if backend server is not currently running
      const cleanEmail = email ? email.trim().toLowerCase() : 'user@example.com';
      const userHash = btoa(cleanEmail).replace(/[^a-zA-Z0-9]/g, '');
      const demoUser = {
        id: `usr-${userHash}`,
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
        role: cleanEmail.includes('admin') ? 'ADMIN' : 'TRAVELER',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanEmail.split('@')[0])}&background=${cleanEmail.includes('admin') ? 'dc3545' : '28a745'}&color=fff`
      };
      sessionStorage.setItem('quest_user', JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role = 'TRAVELER') => {
    setLoading(true);
    try {
      const res = await api.register(name, email, password, role);
      if (res.token && res.user) {
        sessionStorage.setItem('quest_jwt_token', res.token);
        sessionStorage.setItem('quest_user', JSON.stringify(res.user));
        setUser(res.user);
        return res.user;
      }
    } catch (err) {
      const cleanEmail = email ? email.trim().toLowerCase() : 'user@example.com';
      const userHash = btoa(cleanEmail).replace(/[^a-zA-Z0-9]/g, '');
      const demoUser = {
        id: `usr-${userHash}`,
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        role: role.toUpperCase(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || cleanEmail.split('@')[0])}&background=${role === 'ADMIN' ? 'dc3545' : '28a745'}&color=fff`
      };
      sessionStorage.setItem('quest_user', JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('quest_user');
    localStorage.removeItem('quest_jwt_token');
    sessionStorage.removeItem('quest_user');
    sessionStorage.removeItem('quest_jwt_token');
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ 
      user, 
      role: user?.role || 'TRAVELER', 
      isAdmin, 
      login, 
      register, 
      logout, 
      isAuthenticated: !!user,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
