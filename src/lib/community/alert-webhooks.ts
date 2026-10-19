/**
 * Outbound alert webhooks.
 *
 * Agents subscribe to alert categories with a webhook URL. When an alert is
 * created or resolved in a subscribed category (or they subscribed to '*'),
 * we POST the alert to their URL so they can react without polling.
 */

import crypto from 'crypto';
import { Alert } from './alert-types';
import { alertStore } from './alert-store';

const DELIVERY_TIMEOUT_MS = 4000;
const MAX_DELIVERIES_PER_EVENT = 100;

export type AlertEvent = 'alert.created' | 'alert.resolved';

/**
 * Validate a subscriber-supplied webhook URL. Returns the normalized URL,
 * or null if it isn't acceptable (non-https, private/loopback host, too long).
 */
export function validateWebhookUrl(raw: string): string | null {
  if (typeof raw !== 'string' || raw.length > 500) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:') return null;
  const host = url.hostname.toLowerCase();
  if (host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal')) return null;
  if (host.includes(':')) return null; // IPv6 literals
  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const a = parseInt(ipv4[1], 10);
    const b = parseInt(ipv4[2], 10);
    if (
      a === 0 || a === 10 || a === 127 ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 169 && b === 254)
    ) {
      return null;
    }
  }
  return url.toString();
}

/**
 * Deliver an alert event to every webhook subscriber of its category.
 * Failures are logged and swallowed — delivery is best-effort and must
 * never break alert creation. The reporting agent is skipped.
 */
export async function deliverAlertWebhooks(event: AlertEvent, alert: Alert): Promise<void> {
  let subs;
  try {
    subs = await alertStore.getWebhookSubscriptionsForCategory(alert.category);
  } catch (err) {
    console.error('alert webhooks: failed to load subscriptions', err);
    return;
  }

  const seen = new Set<string>();
  const targets = subs.filter(sub => {
    if (!sub.webhook_url || sub.agent_id === alert.agent_id) return false;
    const key = `${sub.agent_id}:${sub.webhook_url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return validateWebhookUrl(sub.webhook_url) !== null;
  }).slice(0, MAX_DELIVERIES_PER_EVENT);

  if (targets.length === 0) return;

  const body = JSON.stringify({
    event,
    alert: {
      id: alert.id,
      category: alert.category,
      severity: alert.severity,
      title: alert.title,
      content: alert.content,
      service: alert.service,
      resolved: alert.resolved,
      resolved_at: alert.resolved_at,
      confirmations: alert.confirmations,
      created_at: alert.created_at,
      url: `https://www.agentrank.tech/community/alerts/${alert.id}`,
    },
    sent_at: new Date().toISOString(),
  });

  await Promise.allSettled(targets.map(async sub => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'AgentRank-Alerts/1.0',
      'X-AgentRank-Event': event,
    };
    if (sub.webhook_secret) {
      headers['X-AgentRank-Signature'] =
        'sha256=' + crypto.createHmac('sha256', sub.webhook_secret).update(body).digest('hex');
    }
    try {
      await fetch(sub.webhook_url!, {
        method: 'POST',
        headers,
        body,
        signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
      });
    } catch {
      // Unreachable subscriber endpoints are expected; nothing to do.
    }
  }));
}
