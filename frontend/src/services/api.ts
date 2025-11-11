import axios, { type AxiosResponse } from 'axios';
import api from '../api/client';
import type { AuthResponse, AuthUser, LogoutResponse } from '../types/auth';


// Generic GET and POST methods
export async function post<T>(path: string, body?: unknown): Promise<T> {
  try {
    const res: AxiosResponse<T> = await api.post(path, body);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data || error.message);
    }
    throw error;
  }
}

export async function get<T>(path: string): Promise<T> {
  try {
    const res: AxiosResponse<T> = await api.get(path);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data || error.message);
    }
    throw error;
  }
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
