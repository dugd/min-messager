// User-related types
export type MyUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  visibility: 'public' | 'private';
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// User public profile information
export type UserProfile = {
  id: number;
  name: string;
  username: string;
  bio?: string;
  avatar_url?: string;
  created_at: string; // ISO date string
};

// User search result type
export type UserSearch = {
  id: number;
  name: string;
  username: string;
  avatar_url?: string;
  created_at: string; // ISO date string
}

// User participant in a group or chat (with role)
export type UserParticipant = {
  id: number;
  name: string;
  username: string;
  avatar_url?: string;
  role: 'member' | 'admin' | 'owner';
}

// Payload
export type UpdateProfilePayload = {
  name?: string;
  username?: string;
  avatar_url?: string;
};

// API response types
export type MyUserResponse = {
  user: MyUser;
};

export type UserProfileResponse = {
  user: UserProfile;
};

export type UserSearchResponse = {
  data: UserSearch[];
};
