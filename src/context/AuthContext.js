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
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
        // Clear token and redirect to login if unauthorized
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  const loadUser = useCallback(async () => {
    try {
      console.log('Loading user data...');
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token ? 'Token exists' : 'No token found');
      
      if (!token) {
        console.log('No token found, skipping user load');
        setLoading(false);
        return;
      }

      console.log('Making request to /auth/me with token');
      const response = await api.get('/auth/me');
      console.log('User data loaded:', response.data);
      
      setUser(response.data);
      setError(null);
    } catch (error) {
      console.error('Error loading user:', error);
      setError('Session expired. Please login again.');
      localStorage.removeItem('token');
      setUser(null);
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
      
      // Store token in localStorage (same as login)
      localStorage.setItem('token', token);
      console.log('Token stored in localStorage after registration');
      
      setUser({ ...newUser, token });
      setError(null);
      return newUser;
    } catch (error) {
      console.error('Registration error in AuthContext:', error.response?.data || error);
      
      // Handle network errors specifically
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        const errorMessage = 'Unable to connect to server. Please make sure the backend server is running on port 5001.';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
      
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
        console.error('Invalid response - missing token or user:', response.data);
        setError('Invalid response from server');
        return null;
      }
      
      console.log('Login successful, setting user and token');
      // Store token in localStorage
      localStorage.setItem('token', token);
      console.log('Token stored in localStorage');
      
      // Set user state
      setUser({ ...loggedInUser, token });
      setError(null);
      
      // Verify token was stored
      const storedToken = localStorage.getItem('token');
      console.log('Verified stored token:', storedToken ? 'Token exists' : 'No token found');
      
      return loggedInUser;
    } catch (error) {
      console.error('Login error:', error.response?.data || error);
      
      // Handle network errors specifically
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        const errorMessage = 'Unable to connect to server. Please make sure the backend server is running on port 5001.';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
      
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw error;
    }
  };

  const logout = useCallback(() => {
    console.log('Logging out, removing token from localStorage');
    localStorage.removeItem('token');
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