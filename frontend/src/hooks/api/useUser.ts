import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserApi } from '../../api/user';
import type { Post } from '../../types/post';
import type { UpdateProfilePayload } from '../../types/user';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  profiles: () => [...userKeys.all, 'profile'] as const,
  profile: (username: string) => [...userKeys.profiles(), username] as const,
  me: () => [...userKeys.all, 'me'] as const,
  search: (query: string) => [...userKeys.all, 'search', query] as const,
  posts: (userId: number) => [...userKeys.all, 'posts', userId] as const,
};

// Get user profile by username
export const useUserProfile = (username: string) => {
  return useQuery({
    queryKey: userKeys.profile(username),
    queryFn: () => UserApi.getProfileByUsername(username),
    enabled: !!username,
  });
};

// Get authenticated user's profile
export const useMe = () => {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => UserApi.getMe(),
  });
};

// Update authenticated user's profile
export const useUpdateMe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => UserApi.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
};

// Search users by query
export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: userKeys.search(query),
    queryFn: () => UserApi.searchUsers(query),
    enabled: query.length > 0,
  });
};

// Mock hook for user posts (mock yet)
export const useUserPosts = (userId: number) => {
  return useQuery({
    queryKey: userKeys.posts(userId),
    queryFn: async (): Promise<Post[]> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Mock posts data
      return [
        {
          id: 1,
          author_id: userId,
          body: 'Just finished implementing the new authentication system. Works great with Laravel Sanctum! 🚀',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          author: {
            id: userId,
            name: 'User Name',
            username: 'username',
            avatar_url: undefined,
          },
        },
        {
          id: 2,
          author_id: userId,
          body: 'Working on real-time messaging features with WebSockets. This is going to be amazing for the user experience.',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          author: {
            id: userId,
            name: 'User Name',
            username: 'username',
            avatar_url: undefined,
          },
        },
        {
          id: 3,
          author_id: userId,
          body: 'Docker makes development so much easier. Everyone should use it!',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
          author: {
            id: userId,
            name: 'User Name',
            username: 'username',
            avatar_url: undefined,
          },
        },
      ];
    },
    enabled: !!userId,
  });
};
