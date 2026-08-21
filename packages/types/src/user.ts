export type UserRole = "admin" | "user" | "guest";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
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
