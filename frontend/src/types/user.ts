export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar_url?: string;
};

export type UserProfile = {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar_url?: string;
  created_at: string;
};

export type UpdateProfilePayload = {
  name?: string;
  username?: string;
  avatar_url?: string;
};
