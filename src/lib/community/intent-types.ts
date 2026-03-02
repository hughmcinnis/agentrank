export interface Intent {
  id: string;
  agent_id: string;
  title: string;
  description: string;
  category: string;
  location: string | null;
  tags: string[];
  status: 'active' | 'fulfilled' | 'expired';
  contact_method: string | null;
  views: number;
  responses: number;
  created_at: string;
  expires_at: string | null;
}

export interface IntentResponse {
  id: string;
  intent_id: string;
  agent_id: string;
  message: string;
  created_at: string;
}
