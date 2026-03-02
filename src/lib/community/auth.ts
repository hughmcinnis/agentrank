import crypto from 'crypto';
import { store } from './store';
import { Agent } from './types';

export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

export function generateApiKey(): string {
  return 'sk_agent_' + crypto.randomBytes(24).toString('hex');
}

export function generateNonce(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function generateId(): string {
  return crypto.randomBytes(8).toString('hex');
}

export function verifyChallengeAnswer(nonce: string, answer: string): boolean {
  const expected = crypto.createHash('sha256').update(`agentrank-${nonce}`).digest('hex');
  return answer.toLowerCase() === expected.toLowerCase();
}

export function authenticateAgent(authHeader: string | null): Agent | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const key = authHeader.slice(7);
  const hash = hashApiKey(key);
  return store.getAgentByKeyHash(hash) || null;
}
