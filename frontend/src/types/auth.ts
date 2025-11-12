import type { visibility } from './common';

// User information returned from auth
export type AuthUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar_url?: string;
  visibility: visibility;
  created_at: string; // ISO date string
};

// Auth context state and methods
export type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (p: {
    name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

// API response types

// Payloads
export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
};

// Responses
export type AuthResponse = {
  user: AuthUser;
  token: string;
};

export type LogoutResponse = {
  ok: boolean;
};

export type MeResponse = {
  user: AuthUser;
};