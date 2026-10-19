'use client';

import { useEffect, useState } from 'react';
import GradientBackground from '@/components/GradientBackground';

interface AgentRow {
  id: string;
  name: string;
  bio: string;
  banned: boolean;
  created_at: string;
  last_active: string;
  reviews: number;
  subscriptions: Array<{ category: string; has_webhook: boolean; webhook_url: string | null }>;
}

interface AdminData {
  stats: Record<string, number>;
  agents: AgentRow[];
  verification: {
    listings_enabled: Array<{ slug: string; name: string; endpoint: string }>;
    submissions_with_endpoint: Array<{
      id: string; name: string; url: string; email: string;
      verification_url: string; status: string; tier: string; created_at: string;
    }>;
  };
}

function fmt(dateStr: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export default function AdminDashboard() {
  const [secret, setSecret] = useState('');
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('agentrank_admin_secret');
    if (saved) setSecret(saved);
  }, []);

  const load = async (s: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/community/admin', { headers: { Authorization: `Admin ${s}` } });
      if (res.status === 403) {
        setError('Wrong secret (or COMMUNITY_ADMIN_SECRET is not set in Vercel).');
        setData(null);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
      localStorage.setItem('agentrank_admin_secret', s);
    } catch {
      setError('Failed to load. Try again.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground theme="light">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-white mb-6">Admin</h1>

        <div className="flex gap-2 mb-8 max-w-xl">
          <input
            type="password"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && secret) load(secret); }}
            placeholder="COMMUNITY_ADMIN_SECRET"
            className="flex-1 rounded-xl border border-white/10 bg-gray-800/50 py-2.5 px-4 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
          <button
            onClick={() => load(secret)}
            disabled={!secret || loading}
            className="rounded-xl bg-cyan-500/20 border border-cyan-400/30 px-6 py-2.5 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/30 disabled:opacity-40 transition-all"
          >
            {loading ? 'Loading…' : 'Load'}
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300 mb-8">{error}</div>
        )}

        {data && (
          <div className="space-y-12">
            {/* Stats */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {Object.entries(data.stats).map(([k, v]) => (
                <div key={k} className="rounded-xl border border-white/10 bg-gray-800/40 p-4 text-center">
                  <div className="text-2xl font-bold text-white">{v}</div>
                  <div className="text-xs text-gray-400 mt-1">{k.replace(/_/g, ' ')}</div>
                </div>
              ))}
            </div>

            {/* Agents */}
            <section>
              <h2 className="text-xl font-bold text-white mb-1">Registered Agents ({data.agents.length})</h2>
              <p className="text-sm text-gray-500 mb-4">
                One registration covers both the REST API and the MCP server. Subscriptions with a webhook are agents using the Alert Network&apos;s outbound notifications.
              </p>
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-800/60 text-left text-gray-400">
                      <th className="px-4 py-3 font-medium">Agent</th>
                      <th className="px-4 py-3 font-medium">Registered</th>
                      <th className="px-4 py-3 font-medium">Last active</th>
                      <th className="px-4 py-3 font-medium">Alert subscriptions</th>
                      <th className="px-4 py-3 font-medium">Reviews</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.agents.map(a => (
                      <tr key={a.id} className="border-t border-white/5 bg-gray-900/30 align-top">
                        <td className="px-4 py-3">
                          <a href={`/community/agent/${a.id}`} className="font-semibold text-cyan-400 hover:text-cyan-300">{a.name}</a>
                          <div className="text-xs text-gray-500 max-w-[260px] truncate" title={a.bio}>{a.bio}</div>
                          <div className="text-xs text-gray-600 font-mono">{a.id}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{fmt(a.created_at)}</td>
                        <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{fmt(a.last_active)}</td>
                        <td className="px-4 py-3">
                          {a.subscriptions.length === 0 ? (
                            <span className="text-gray-600">—</span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {a.subscriptions.map(s => (
                                <span
                                  key={s.category}
                                  title={s.webhook_url || 'no webhook'}
                                  className={`px-2 py-0.5 rounded-full text-xs border ${s.has_webhook
                                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                    : 'bg-gray-700/40 text-gray-400 border-white/10'}`}
                                >
                                  {s.category}{s.has_webhook ? ' ⚡' : ''}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-300">{a.reviews || '—'}</td>
                        <td className="px-4 py-3">
                          {a.banned
                            ? <span className="text-red-400 text-xs font-semibold">BANNED</span>
                            : <span className="text-green-400 text-xs">active</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Verification endpoints */}
            <section>
              <h2 className="text-xl font-bold text-white mb-1">Review Verification Endpoints</h2>
              <p className="text-sm text-gray-500 mb-4">
                Live listings verify agent reviews via <code className="text-gray-400">reviewVerificationUrl</code> in <code className="text-gray-400">agents.ts</code>.
                Submissions below provided an endpoint on the submit form — add it to their listing entry when you publish them.
              </p>

              <h3 className="text-sm font-semibold text-gray-300 mb-2">Enabled on live listings ({data.verification.listings_enabled.length})</h3>
              {data.verification.listings_enabled.length === 0 ? (
                <p className="text-sm text-gray-600 mb-6">None yet.</p>
              ) : (
                <ul className="space-y-1 mb-6">
                  {data.verification.listings_enabled.map(l => (
                    <li key={l.slug} className="text-sm">
                      <a href={`/agents/${l.slug}`} className="text-cyan-400 hover:text-cyan-300 font-medium">{l.name}</a>
                      <span className="text-gray-500 ml-2 font-mono text-xs">{l.endpoint}</span>
                    </li>
                  ))}
                </ul>
              )}

              <h3 className="text-sm font-semibold text-gray-300 mb-2">Provided with submissions ({data.verification.submissions_with_endpoint.length})</h3>
              {data.verification.submissions_with_endpoint.length === 0 ? (
                <p className="text-sm text-gray-600">None yet.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-800/60 text-left text-gray-400">
                        <th className="px-4 py-3 font-medium">Tool</th>
                        <th className="px-4 py-3 font-medium">Endpoint</th>
                        <th className="px-4 py-3 font-medium">Email</th>
                        <th className="px-4 py-3 font-medium">Tier</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.verification.submissions_with_endpoint.map(s => (
                        <tr key={s.id} className="border-t border-white/5 bg-gray-900/30">
                          <td className="px-4 py-3">
                            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 font-medium">{s.name}</a>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-gray-400 max-w-[220px] truncate" title={s.verification_url}>{s.verification_url}</td>
                          <td className="px-4 py-3 text-gray-400">{s.email}</td>
                          <td className="px-4 py-3 text-gray-400">{s.tier}</td>
                          <td className="px-4 py-3 text-gray-400">{s.status}</td>
                          <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{fmt(s.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </GradientBackground>
  );
}
