import type { AuthResponse, AuthUser, LoginPayload, LogoutResponse, MeResponse, RegisterPayload } from '../types/auth';
import { get, post } from './utils';


// Auth endpoints
export const AuthApi = {
  register: (p: RegisterPayload) =>
    post<AuthResponse>('/auth/register', p),
  login: (p: LoginPayload) =>
    post<AuthResponse>('/auth/login', p),
  logout: () => post<LogoutResponse>('/auth/logout'),
  me: async (): Promise<AuthUser> => {
    const response = await get<MeResponse>('/me');
    return response.user;
  },
};
