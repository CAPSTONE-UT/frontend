import { api } from './axios';
import type {
  BaseResponse,
  LoginData,
  LoginRequest,
  RegisterData,
  RegisterRequest,
  UserProfile,
} from '@/types/api';

export const authService = {
  checkHealth: () => api.get<BaseResponse<{ status: 'ok' }>>('/health'),

  login: (data: LoginRequest) =>
    api.post<BaseResponse<LoginData>>('/api/v1/auth/login', data, {
      headers: { 'Content-Type': 'application/json' },
    }),

  register: (data: RegisterRequest) =>
    api.post<BaseResponse<RegisterData>>('/api/v1/auth/register', data, {
      headers: { 'Content-Type': 'application/json' },
    }),

  getProfile: () => api.get<BaseResponse<UserProfile>>('/api/v1/auth/profile'),

  logout: () => api.post<BaseResponse>('/api/v1/auth/logout'),
};
