// src/lib/auth.ts
import axios from 'axios';
import api, { setAuthToken } from './api';

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/api/token/', { username, password });
    const { access, refresh } = response.data;
    setAuthToken(access);
    localStorage.setItem('refreshToken', refresh);
    return { success: true };
  } catch (error: unknown) {
    const message = axios.isAxiosError<{ detail?: string }>(error)
      ? error.response?.data?.detail
      : null;
    console.error('Login failed:', error);
    return { success: false, message: message || 'Login error' };
  }
};
