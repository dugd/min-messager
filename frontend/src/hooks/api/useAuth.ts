import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthApi } from '../../api/auth';
import type { LoginPayload, RegisterPayload } from '../../types/auth';
import { getToken, removeToken, setToken } from '../../utils/tokenStorage';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

// Get current authenticated user
export const useAuthMe = () => {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => AuthApi.me(),
    enabled: !!getToken(),
    retry: false,
  });
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => AuthApi.login(payload),
    onSuccess: (data) => {
      setToken(data.token);
      queryClient.setQueryData(authKeys.me(), data.user);
    },
  });
};

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => AuthApi.register(payload),
    onSuccess: (data) => {
      setToken(data.token);
      queryClient.setQueryData(authKeys.me(), data.user);
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AuthApi.logout(),
    onSuccess: () => {
      removeToken();
      queryClient.setQueryData(authKeys.me(), null);
      queryClient.clear();
    },
    onError: () => {
      // Even on error, clear local state
      removeToken();
      queryClient.setQueryData(authKeys.me(), null);
      queryClient.clear();
    },
  });
};
