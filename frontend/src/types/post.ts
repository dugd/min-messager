export type Post = {
  id: number;
  author_id: number;
  body: string;
  created_at: string;
  author?: {
    id: number;
    name: string;
    username: string;
    avatar_url?: string;
  };
};
