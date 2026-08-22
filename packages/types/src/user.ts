export type UserRole = "admin" | "user" | "guest";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  phone: string;
  timezone: string;
  plan: string;
  status: string;
  memberSince: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  role?: string;
  timezone?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
}

export interface CreateApiKeyPayload {
  name: string;
}

export interface UserSession {
  user: User;
  token: string;
  expiresAt: string;
}

export interface CreateUserPayload {
  email: string;
  name: string;
  role?: UserRole;
}

