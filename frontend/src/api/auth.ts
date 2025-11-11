import type { AuthResponse, AuthUser, LoginPayload, LogoutResponse, RegisterPayload } from '../types/auth';
import { get, post } from './utils';


// Auth endpoints
export const AuthApi = {
  register: (p: RegisterPayload) =>
    post<AuthResponse>('/auth/register', p),
  login: (p: LoginPayload) =>
    post<AuthResponse>('/auth/login', p),
  logout: () => post<LogoutResponse>('/auth/logout'),
  me: () => get<AuthUser>('/me'),
};
