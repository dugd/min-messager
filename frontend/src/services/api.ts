const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost/api';

// Define types for API responses
export type AuthUser = {
  id: number; name: string; username: string; email: string;
};


// Helper to get auth headers
function authHeader(): { Authorization?: string } {
  const token = localStorage.getItem('token');
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
    post<{user: AuthUser; token: string}>('/auth/register', p),
  login: (p: {email:string;password:string}) =>
    post<{user: AuthUser; token: string}>('/auth/login', p),
  logout: () => post<{ok: boolean}>('/auth/logout'),
  me: () => get<AuthUser>('/me'),
};
