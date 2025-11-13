import type { MyUser, MyUserResponse, UpdateProfilePayload, UserProfile, UserProfileResponse, UserSearchResponse } from '../types/user';
import { get, patch } from './utils';

export const UserApi = {
  getProfileByUsername: async (username: string): Promise<UserProfile> => {
    const response = await get<UserProfileResponse>(`/users/profiles/${username}`);
    return response.user;
  },
  getMe: async (): Promise<MyUser> => {
    const response = await get<MyUserResponse>('/users/me');
    return response.user;
  },
  updateMe: async (data: UpdateProfilePayload): Promise<UserProfile> => {
    const response = await patch<UserProfileResponse>('/users/me', data);
    return response.user;
  },
  searchUsers: async (query: string) => {
    const response = await get<UserSearchResponse>(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};
