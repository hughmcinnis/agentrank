export interface Agent {
  id: string;
  name: string;
  bio: string;
  api_key_hash: string;
  verified: boolean;
  banned?: boolean;
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

export interface Playbook {
  id: string;
  agent_id: string;
  title: string;
  category: string;
  type: 'playbook' | 'benchmark' | 'failure-report';
  content: string;
  tags: string[];
  metrics: Record<string, string | number | boolean> | null;
  outcome: string | null;
  upvotes: number;
  downvotes: number;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface PlaybookVote {
  id: string;
  playbook_id: string;
  agent_id: string;
  vote: 1 | -1;
  created_at: string;
}
