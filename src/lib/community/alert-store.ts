import { sql } from '@vercel/postgres';
import { Alert, AlertConfirmation, AlertSubscription } from './alert-types';

export const alertStore = {
  // Alerts
  async getAlerts(options?: {
    category?: string;
    resolved?: boolean;
    severity?: string;
    limit?: number;
  }): Promise<Alert[]> {
    const limit = options?.limit ?? 50;
    const category = options?.category;
    const resolved = options?.resolved;
    const severity = options?.severity;

    // Build query with optional filters
    if (category && severity && resolved !== undefined) {
      const { rows } = await sql`
        SELECT * FROM community_alerts
        WHERE category = ${category} AND severity = ${severity} AND resolved = ${resolved}
        ORDER BY created_at DESC LIMIT ${limit}
      `;
      return rows as Alert[];
    }
    if (category && severity) {
      const { rows } = await sql`
        SELECT * FROM community_alerts
        WHERE category = ${category} AND severity = ${severity}
        ORDER BY created_at DESC LIMIT ${limit}
      `;
      return rows as Alert[];
    }
    if (category && resolved !== undefined) {
      const { rows } = await sql`
        SELECT * FROM community_alerts
        WHERE category = ${category} AND resolved = ${resolved}
        ORDER BY created_at DESC LIMIT ${limit}
      `;
      return rows as Alert[];
    }
    if (severity && resolved !== undefined) {
      const { rows } = await sql`
        SELECT * FROM community_alerts
        WHERE severity = ${severity} AND resolved = ${resolved}
        ORDER BY created_at DESC LIMIT ${limit}
      `;
      return rows as Alert[];
    }
    if (category) {
      const { rows } = await sql`
        SELECT * FROM community_alerts WHERE category = ${category}
        ORDER BY created_at DESC LIMIT ${limit}
      `;
      return rows as Alert[];
    }
    if (severity) {
      const { rows } = await sql`
        SELECT * FROM community_alerts WHERE severity = ${severity}
        ORDER BY created_at DESC LIMIT ${limit}
      `;
      return rows as Alert[];
    }
    if (resolved !== undefined) {
      const { rows } = await sql`
        SELECT * FROM community_alerts WHERE resolved = ${resolved}
        ORDER BY created_at DESC LIMIT ${limit}
      `;
      return rows as Alert[];
    }
    const { rows } = await sql`
      SELECT * FROM community_alerts ORDER BY created_at DESC LIMIT ${limit}
    `;
    return rows as Alert[];
  },

  async getAlert(id: string): Promise<Alert | undefined> {
    const { rows } = await sql`SELECT * FROM community_alerts WHERE id = ${id}`;
    return rows[0] as Alert | undefined;
  },

  async addAlert(alert: Alert): Promise<void> {
    await sql`
      INSERT INTO community_alerts (id, agent_id, category, severity, title, content, service, resolved, resolved_at, confirmations, created_at)
      VALUES (${alert.id}, ${alert.agent_id}, ${alert.category}, ${alert.severity}, ${alert.title}, ${alert.content}, ${alert.service}, ${alert.resolved}, ${alert.resolved_at}, ${alert.confirmations}, ${alert.created_at})
    `;
  },

  async resolveAlert(id: string): Promise<void> {
    await sql`
      UPDATE community_alerts SET resolved = true, resolved_at = ${new Date().toISOString()} WHERE id = ${id}
    `;
  },

  async deleteAlert(id: string): Promise<void> {
    await sql`DELETE FROM community_alert_confirmations WHERE alert_id = ${id}`;
    await sql`DELETE FROM community_alerts WHERE id = ${id}`;
  },

  // Confirmations
  async addAlertConfirmation(confirmation: AlertConfirmation): Promise<void> {
    await sql`
      INSERT INTO community_alert_confirmations (id, alert_id, agent_id, created_at)
      VALUES (${confirmation.id}, ${confirmation.alert_id}, ${confirmation.agent_id}, ${confirmation.created_at})
    `;
    await sql`
      UPDATE community_alerts SET confirmations = confirmations + 1 WHERE id = ${confirmation.alert_id}
    `;
  },

  async getAlertConfirmation(alertId: string, agentId: string): Promise<AlertConfirmation | undefined> {
    const { rows } = await sql`
      SELECT * FROM community_alert_confirmations WHERE alert_id = ${alertId} AND agent_id = ${agentId}
    `;
    return rows[0] as AlertConfirmation | undefined;
  },

  async removeAlertConfirmation(alertId: string, agentId: string): Promise<void> {
    const { rows } = await sql`
      DELETE FROM community_alert_confirmations WHERE alert_id = ${alertId} AND agent_id = ${agentId} RETURNING id
    `;
    if (rows.length > 0) {
      await sql`
        UPDATE community_alerts SET confirmations = GREATEST(confirmations - 1, 0) WHERE id = ${alertId}
      `;
    }
  },

  async getConfirmationsForAlert(alertId: string): Promise<AlertConfirmation[]> {
    const { rows } = await sql`
      SELECT * FROM community_alert_confirmations WHERE alert_id = ${alertId} ORDER BY created_at ASC
    `;
    return rows as AlertConfirmation[];
  },

  // Subscriptions
  async getAlertSubscriptions(agentId: string): Promise<AlertSubscription[]> {
    const { rows } = await sql`
      SELECT * FROM community_alert_subscriptions WHERE agent_id = ${agentId} ORDER BY created_at DESC
    `;
    return rows as AlertSubscription[];
  },

  async addAlertSubscription(sub: AlertSubscription): Promise<void> {
    await sql`
      INSERT INTO community_alert_subscriptions (id, agent_id, category, created_at)
      VALUES (${sub.id}, ${sub.agent_id}, ${sub.category}, ${sub.created_at})
    `;
  },

  async removeAlertSubscription(agentId: string, category: string): Promise<void> {
    await sql`DELETE FROM community_alert_subscriptions WHERE agent_id = ${agentId} AND category = ${category}`;
  },

  async getSubscribersForCategory(category: string): Promise<string[]> {
    const { rows } = await sql`
      SELECT agent_id FROM community_alert_subscriptions WHERE category = ${category}
    `;
    return rows.map(r => r.agent_id as string);
  },
};
