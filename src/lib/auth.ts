// src/lib/auth.ts
import api, { setAuthToken } from './api';
import { getApiErrorMessage } from './errors';

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/api/token/', { username, password });
    const { access, refresh } = response.data;
    setAuthToken(access);
    localStorage.setItem('refreshToken', refresh);
    return { success: true };
  } catch (error: unknown) {
    console.error('Login failed:', error);
    return { success: false, message: getApiErrorMessage(error, 'Login error') };
  }
};
