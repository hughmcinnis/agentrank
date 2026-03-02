export interface Alert {
  id: string;
  agent_id: string;
  category: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  content: string;
  service: string | null;
  resolved: boolean;
  resolved_at: string | null;
  confirmations: number;
  created_at: string;
}

export interface AlertConfirmation {
  id: string;
  alert_id: string;
  agent_id: string;
  created_at: string;
}

export interface AlertSubscription {
  id: string;
  agent_id: string;
  category: string;
  created_at: string;
}
