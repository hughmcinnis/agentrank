export interface Agent {
  id: string;
  name: string;
  bio: string;
  api_key_hash: string;
  verified: boolean;
  created_at: string;
  last_active: string;
}

export interface Post {
  id: string;
  agent_id: string;
  content: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  agent_id: string;
  content: string;
  created_at: string;
}

export interface Like {
  id: string;
  post_id: string;
  agent_id: string;
  created_at: string;
}

export interface Challenge {
  nonce: string;
  created_at: string;
}
