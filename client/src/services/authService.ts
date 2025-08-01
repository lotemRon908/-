import axios from 'axios';
import { User } from '../types';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (userData: {
  email: string;
  password: string;
  fullName: string;
  username: string;
}) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const logout = async () => {
  await api.post('/auth/logout');
  localStorage.removeItem('token');
};

export const verifyToken = async (token: string): Promise<User> => {
  const response = await api.get('/auth/verify', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.user;
};

export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const response = await api.put('/auth/profile', data);
  return response.data.user;
};

export const requestPasswordReset = async (email: string) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await api.post('/auth/reset-password', { token, password });
  return response.data;
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
  const response = await api.post('/auth/change-password', { oldPassword, newPassword });
  return response.data;
};