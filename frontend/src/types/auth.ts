export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  refresh_expires_in: number;
};

export type User = {
  id: number;
  email: string;
  name?: string | null;
  full_name?: string | null;
  is_active: boolean;
  is_superuser: boolean;
  tenant_id?: number | null;
  created_at: string;
  updated_at: string;
};
