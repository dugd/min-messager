import { useEffect, useState } from 'react';
import { AuthApi } from '../api/auth';
import type { AuthState, AuthUser } from '../types/auth';
import { getToken, removeToken, setToken } from '../utils/tokenStorage';

// Custom hook for managing authentication state
export function useAuthState(): AuthState {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Refresh user data from server using stored token
  const refreshMe = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      return;
    }
    try {
      setUser(await AuthApi.me());
    } catch {
      setUser(null);
    }
  };

  // Initialize: fetch user on mount
  useEffect(() => {
    refreshMe().finally(() => setLoading(false));
  }, []);

  // Login with email and password
  const login = async (email: string, password: string) => {
    const { user, token } = await AuthApi.login({ email, password });
    setToken(token);
    setUser(user);
  };

  // Register new user
  const register = async (p: {
    name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    const { user, token } = await AuthApi.register(p);
    setToken(token);
    setUser(user);
  };

  // Logout current user
  const logout = async () => {
    try {
      await AuthApi.logout();
    } catch {}
    removeToken();
    setUser(null);
  };

  return { user, loading, login, register, logout, refreshMe };
}
