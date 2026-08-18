import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('tripnest_token'));
  const [loading, setLoading] = useState(true);

  // Initialize and verify authentication state
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('tripnest_token');
      const savedUser = localStorage.getItem('tripnest_user');

      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Validate with server
          const res = await api.get('/users/me');
          if (res.data?.data) {
            setUser(res.data.data);
            localStorage.setItem('tripnest_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const authData = res.data.data;

    setToken(authData.token);
    setUser(authData);
    localStorage.setItem('tripnest_token', authData.token);
    localStorage.setItem('tripnest_user', JSON.stringify(authData));
    return authData;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const authData = res.data.data;

    setToken(authData.token);
    setUser(authData);
    localStorage.setItem('tripnest_token', authData.token);
    localStorage.setItem('tripnest_user', JSON.stringify(authData));
    return authData;
  };

  const oauthLogin = async (oauthData) => {
    const res = await api.post('/auth/oauth2/google', oauthData);
    const authData = res.data.data;

    setToken(authData.token);
    setUser(authData);
    localStorage.setItem('tripnest_token', authData.token);
    localStorage.setItem('tripnest_user', JSON.stringify(authData));
    return authData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('tripnest_token');
    localStorage.removeItem('tripnest_user');
  };

  const updateProfile = async (profileData) => {
    const res = await api.put('/users/profile', profileData);
    const updated = res.data.data;
    setUser((prev) => ({ ...prev, ...updated }));
    localStorage.setItem('tripnest_user', JSON.stringify({ ...user, ...updated }));
    return updated;
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/users/me');
      if (res.data?.data) {
        setUser(res.data.data);
        localStorage.setItem('tripnest_user', JSON.stringify(res.data.data));
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN';
  const isGroupAdmin = user?.role === 'ROLE_GROUP_ADMIN' || user?.role === 'GROUP_ADMIN' || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        isGroupAdmin,
        login,
        register,
        oauthLogin,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
