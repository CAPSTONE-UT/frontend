export interface ApiErrorDetail {
  path: string;
  message: string;
}

export interface ApiError {
  code: string;
  details?: ApiErrorDetail[];
}

export interface BaseResponse<T = never> {
  success: boolean;
  message?: string;
  data?: T;
  error?: ApiError;
}

export interface UserSession {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
  expires_at: number;
}

export interface UserProfile {
  user_id: string;
  full_name: string;
  email: string;
  staff_id: string;
  school_unit: string;
  role: 'staff' | 'inventory_officer' | 'admin';
  account_status: 'active' | 'inactive';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  staff_id: string;
  school_unit: string;
}

export interface LoginData {
  session: UserSession;
  user: UserProfile;
}

export interface RegisterData {
  user_id: string;
  email: string;
  email_verification_required: boolean;
  session?: UserSession;
}
