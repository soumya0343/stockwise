import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Create auth context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add auth token to requests
  api.interceptors.request.use(
    (config) => {
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Handle response errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );

  const loadUser = useCallback(async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
      setError(null);
    } catch (error) {
      console.error('Error loading user:', error);
      setError('Session expired. Please login again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Check auth status on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const register = async (userData) => {
    try {
      console.log('Attempting registration with data:', { ...userData, password: '[REDACTED]' });
      const response = await api.post('/auth/register', userData);
      console.log('Registration response:', response.data);
      
      const { token, user: newUser } = response.data;
      setUser({ ...newUser, token });
      setError(null);
      return newUser;
    } catch (error) {
      console.error('Registration error in AuthContext:', error.response?.data || error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      console.log('Making login request to server...');
      const response = await api.post('/auth/login', credentials);
      console.log('Server response:', response.data);
      
      const { token, user: loggedInUser } = response.data;
      
      if (!token || !loggedInUser) {
        console.log('Invalid response - missing token or user');
        setError('Invalid response from server');
        return null;
      }
      
      console.log('Login successful, setting user');
      setUser({ ...loggedInUser, token });
      setError(null);
      return loggedInUser;
    } catch (error) {
      console.error('Login error:', error.response?.data || error);
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw error;
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  const updateUserProfile = async (profileData) => {
    try {
      const response = await api.put('/user/profile', profileData);
      setUser({ ...response.data, token: user.token });
      setError(null);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Profile update failed');
      throw error;
    }
  };

  const updateUserStats = async (statsData) => {
    try {
      const response = await api.put('/user/stats', statsData);
      setUser({ ...response.data, token: user.token });
      setError(null);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Stats update failed');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateUserProfile,
    updateUserStats,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};