// Shared auth type definitions between frontend and backend
// Frontend: imported as @shared/types/auth
// Backend: referenced for API contract documentation

export interface User {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_superuser: boolean;
  tenant_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  refresh_expires_in: number;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface TokenPayload {
  sub: string;
  exp: number;
  type: 'access' | 'refresh';
  tid?: number;
  role?: 'admin' | 'user';
  jti?: string;
}
