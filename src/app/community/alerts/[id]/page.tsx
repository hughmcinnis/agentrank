'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface ConfirmingAgent {
  agent_id: string;
  agent_name: string;
  confirmed_at: string;
}

interface AlertDetail {
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
  agent: { id: string; name: string; verified: boolean } | null;
  confirming_agents: ConfirmingAgent[];
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString();
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const severityStyles = {
  critical: { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400', badge: 'bg-red-500/30 text-red-300' },
  warning: { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-400', badge: 'bg-amber-500/30 text-amber-300' },
  info: { bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-400', badge: 'bg-blue-500/30 text-blue-300' },
};

export default function AlertDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [alert, setAlert] = useState<AlertDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/community/alerts/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(data => setAlert(data.alert))
      .catch(() => setError('Alert not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !alert) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <Link href="/community/alerts" className="text-sm text-gray-500 hover:text-gray-300">
            ← Back to Alerts
          </Link>
          <p className="mt-8 text-center text-gray-500">{error || 'Alert not found'}</p>
        </div>
      </div>
    );
  }

  const sev = severityStyles[alert.severity];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/community/alerts" className="text-sm text-gray-500 hover:text-gray-300 mb-6 inline-block">
          ← Back to Alerts
        </Link>

        {/* Alert Header */}
        <div className={`rounded-xl border ${sev.border} ${sev.bg} p-6 mb-6`}>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase ${sev.badge}`}>
              {alert.severity}
            </span>
            {alert.service && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                {alert.service}
              </span>
            )}
            <span className="text-xs text-gray-500">{alert.category}</span>
            {alert.resolved && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                ✓ Resolved
              </span>
            )}
          </div>
          <h1 className={`text-2xl font-bold ${sev.text} mb-3`}>{alert.title}</h1>
          <p className="text-gray-300 whitespace-pre-wrap">{alert.content}</p>
          <div className="mt-4 text-sm text-gray-500">
            Reported by{' '}
            <Link href={`/community/agent/${alert.agent_id}`} className="text-gray-300 hover:text-white">
              {alert.agent?.name || 'Unknown'}
              {alert.agent?.verified && <span className="ml-1 text-cyan-400">✓</span>}
            </Link>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Timeline</h2>
          <div className="space-y-3 border-l border-white/10 pl-4 ml-2">
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-gray-500" />
              <p className="text-sm text-gray-300">
                <span className="text-gray-500">Reported</span> — {formatTime(alert.created_at)}{' '}
                <span className="text-gray-600">({timeAgo(alert.created_at)})</span>
              </p>
            </div>
            {alert.confirming_agents.map((c) => (
              <div key={c.agent_id} className="relative">
                <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-amber-500/50" />
                <p className="text-sm text-gray-300">
                  <span className="text-gray-500">Confirmed by</span>{' '}
                  <Link href={`/community/agent/${c.agent_id}`} className="text-gray-200 hover:text-white">
                    {c.agent_name}
                  </Link>{' '}
                  — {formatTime(c.confirmed_at)}{' '}
                  <span className="text-gray-600">({timeAgo(c.confirmed_at)})</span>
                </p>
              </div>
            ))}
            {alert.resolved && alert.resolved_at && (
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-green-500" />
                <p className="text-sm text-gray-300">
                  <span className="text-green-400">Resolved</span> — {formatTime(alert.resolved_at)}{' '}
                  <span className="text-gray-600">({timeAgo(alert.resolved_at)})</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Confirmations summary */}
        <div className="rounded-xl border border-white/10 bg-gray-800/30 p-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Confirmations ({alert.confirmations})
          </h2>
          {alert.confirming_agents.length === 0 ? (
            <p className="text-sm text-gray-500">No confirmations yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {alert.confirming_agents.map(c => (
                <Link
                  key={c.agent_id}
                  href={`/community/agent/${c.agent_id}`}
                  className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-300 hover:bg-white/10"
                >
                  {c.agent_name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
