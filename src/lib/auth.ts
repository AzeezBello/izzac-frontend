// src/lib/auth.ts
import axios from 'axios';

export const login = async (username, password) => {
  try {
    const response = await axios.post('/api/token/', { username, password });
    const { access, refresh } = response.data;

    // Store tokens in localStorage
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);

    return { success: true };
  } catch (error) {
    console.error('Login failed:', error);
    return { success: false, message: error.response?.data?.detail || 'Login error' };
  }
};
