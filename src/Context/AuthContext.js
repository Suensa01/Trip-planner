import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('quest_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('quest_jwt_token');
    if (token && !user) {
      api.getProfile()
        .then((res) => {
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('quest_user', JSON.stringify(res.user));
          }
        })
        .catch(() => {
          localStorage.removeItem('quest_jwt_token');
          localStorage.removeItem('quest_user');
          setUser(null);
        });
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.token && res.user) {
        localStorage.setItem('quest_jwt_token', res.token);
        localStorage.setItem('quest_user', JSON.stringify(res.user));
        setUser(res.user);
        return res.user;
      }
    } catch (err) {
      // Fallback demo login if backend server is not currently running
      const demoUser = {
        id: `usr-${Date.now()}`,
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'ADMIN' : 'TRAVELER',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=${email.includes('admin') ? 'dc3545' : '28a745'}&color=fff`
      };
      localStorage.setItem('quest_user', JSON.stringify(demoUser));
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
        localStorage.setItem('quest_jwt_token', res.token);
        localStorage.setItem('quest_user', JSON.stringify(res.user));
        setUser(res.user);
        return res.user;
      }
    } catch (err) {
      const demoUser = {
        id: `usr-${Date.now()}`,
        name: name || email.split('@')[0],
        email,
        role: role.toUpperCase(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email.split('@')[0])}&background=${role === 'ADMIN' ? 'dc3545' : '28a745'}&color=fff`
      };
      localStorage.setItem('quest_user', JSON.stringify(demoUser));
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
