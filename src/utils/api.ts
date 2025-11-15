const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

interface LoginResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

interface RegisterResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export const api = {
  register: async (userData) => {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  }
};