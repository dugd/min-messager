import type { AuthState } from '../types/auth';
import { useAuthMe, useLogin, useLogout, useRegister } from './api/useAuth';

// Custom hook for managing authentication state
export function useAuthState(): AuthState {
  const { data: user = null, isLoading: loading, refetch } = useAuthMe();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  // Login with email and password
  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  // Register new user
  const register = async (p: {
    name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    await registerMutation.mutateAsync(p);
  };

  // Logout current user
  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  // Refresh user data from server
  const refreshMe = async () => {
    await refetch();
  };

  return { user, loading, login, register, logout, refreshMe };
}
