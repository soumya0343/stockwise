const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

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
    auth: {
        async login(email: string, password: string): Promise<LoginResponse> {
            const response = await fetch(`${BASE_URL}/auth/login`, {
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
        },

        async register(data: { 
            name: string; 
            email: string; 
            password: string; 
        }): Promise<RegisterResponse> {
            const response = await fetch(`${BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Registration failed');
            }

            return response.json();
        }
    }
};