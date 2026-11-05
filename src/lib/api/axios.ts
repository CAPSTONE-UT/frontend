// src/lib/api/axios.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  // Ambil token dari localStorage jika dijalankan di sisi client (browser)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    const isProtectedRoute = config.url === '/api/v1/auth/profile' || config.url === '/api/v1/auth/logout';
    if (token && isProtectedRoute && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
