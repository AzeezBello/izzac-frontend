// src/lib/auth.ts
import api, { setAuthToken } from './api';

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/api/token/', { username, password });
    const { access, refresh } = response.data;
    setAuthToken(access);
    localStorage.setItem('refreshToken', refresh);
    return { success: true };
  } catch (error: any) {
    console.error('Login failed:', error);
    return { success: false, message: error.response?.data?.detail || 'Login error' };
  }
};
