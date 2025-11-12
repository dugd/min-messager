import type { UpdateProfilePayload, User, UserProfile } from '../types/user';
import { get, patch } from './utils';

export const UserApi = {
  getProfile: (userId: number) =>
    get<UserProfile>(`/users/profiles/${userId}`),
  getMe: () => get<UserProfile>('/users/me'),
  updateMe: (data: UpdateProfilePayload) =>
    patch<UserProfile>('/users/me', data),
  searchUsers: (query: string) =>
    get<User[]>(`/users/search?q=${encodeURIComponent(query)}`),
};
