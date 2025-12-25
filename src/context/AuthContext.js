import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create auth context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add auth token to requests
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  const loadUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get("/auth/me");
      setUser(response.data);
      setError(null);
    } catch (error) {
      // Only clear token if it's actually invalid (401)
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setUser(null);
      }
      // Don't set error for network issues on initial load
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
      const response = await api.post("/auth/register", userData);
      const { token, user: newUser } = response.data;

      localStorage.setItem("token", token);
      setUser({ ...newUser, token });
      setError(null);
      return newUser;
    } catch (error) {
      if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
        const errorMessage =
          "Unable to connect to server. Please make sure the backend server is running on port 5001.";
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      const errorMessage =
        error.response?.data?.message || "Registration failed";
      setError(errorMessage);
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const { token, user: loggedInUser } = response.data;

      if (!token || !loggedInUser) {
        setError("Invalid response from server");
        return null;
      }

      localStorage.setItem("token", token);
      setUser({ ...loggedInUser, token });
      setError(null);

      return loggedInUser;
    } catch (error) {
      if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
        const errorMessage =
          "Unable to connect to server. Please make sure the backend server is running on port 5001.";
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage);
      throw error;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setError(null);
  }, []);

  const updateUserProfile = async (profileData) => {
    try {
      const response = await api.put("/user/profile", profileData);
      setUser({ ...response.data, token: user.token });
      setError(null);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Profile update failed");
      throw error;
    }
  };

  const updateUserStats = async (statsData) => {
    try {
      const response = await api.put("/user/stats", statsData);
      setUser({ ...response.data, token: user.token });
      setError(null);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Stats update failed");
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
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
