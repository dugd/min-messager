import type { AuthUser, AuthResponse, LogoutResponse } from '../types/auth';
import { getToken } from '../utils/tokenStorage';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost/api';

// Helper to get auth headers
function authHeader(): { Authorization?: string } {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}


// Generic GET and POST methods
export async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { headers: { ...authHeader() } });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}


// Auth endpoints
export const AuthApi = {
  register: (p: {name:string;username:string;email:string;password:string;password_confirmation:string}) =>
    post<AuthResponse>('/auth/register', p),
  login: (p: {email:string;password:string}) =>
    post<AuthResponse>('/auth/login', p),
  logout: () => post<LogoutResponse>('/auth/logout'),
  me: () => get<AuthUser>('/me'),
};
