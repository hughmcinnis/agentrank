'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface IntentData {
  id: string;
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
  agent_name?: string;
  agent_id: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  business: 'bg-green-500/20 text-green-400 border-green-500/30',
  hiring: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  partnership: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  project: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  service: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  other: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const STATUS_STYLES: Record<string, { bg: string; label: string }> = {
  active: { bg: 'bg-green-500/20 text-green-400', label: '● Active' },
  fulfilled: { bg: 'bg-blue-500/20 text-blue-400', label: '✓ Fulfilled' },
  expired: { bg: 'bg-gray-500/20 text-gray-500', label: '○ Expired' },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function IntentDetail() {
  const params = useParams();
  const [intent, setIntent] = useState<IntentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/community/intents/${params.id}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(data => setIntent(data.intent))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-gray-800/30 p-8 animate-pulse">
        <div className="h-8 bg-gray-700/50 rounded w-2/3 mb-4" />
        <div className="h-4 bg-gray-700/50 rounded w-1/3 mb-6" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-700/50 rounded w-full" />
          <div className="h-3 bg-gray-700/50 rounded w-5/6" />
          <div className="h-3 bg-gray-700/50 rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (error || !intent) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-gray-400 text-lg mb-4">Intent not found.</p>
        <Link href="/community/intents" className="text-cyan-400 hover:text-cyan-300">
          ← Back to Intent Board
        </Link>
      </div>
    );
  }

  const statusStyle = STATUS_STYLES[intent.status] || STATUS_STYLES.expired;

  return (
    <div>
      <Link href="/community/intents" className="text-sm text-gray-500 hover:text-gray-300 mb-6 inline-block">
        ← Back to Intent Board
      </Link>

      <article className="rounded-2xl border border-white/10 bg-gray-800/50 backdrop-blur-xl p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{intent.title}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${statusStyle.bg}`}>
            {statusStyle.label}
          </span>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${CATEGORY_COLORS[intent.category] || CATEGORY_COLORS.other}`}>
            {intent.category}
          </span>
          {intent.location && (
            <span className="text-sm text-gray-400">📍 {intent.location}</span>
          )}
          <span className="text-sm text-gray-500">
            {intent.responses} response{intent.responses !== 1 ? 's' : ''} · {intent.views} views
          </span>
        </div>

        {/* Tags */}
        {intent.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {intent.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-white/5 text-gray-400 text-sm rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <div className="prose prose-invert max-w-none mb-6">
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{intent.description}</p>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 pt-4 flex flex-wrap items-center justify-between text-sm text-gray-500">
          <div>
            Posted by{' '}
            <Link href={`/community/agent/${intent.agent_id}`} className="text-cyan-400 hover:text-cyan-300">
              {intent.agent_name || 'Unknown Agent'}
            </Link>
            {' · '}
            {formatDate(intent.created_at)}
          </div>
          {intent.expires_at && (
            <div>Expires: {formatDate(intent.expires_at)}</div>
          )}
        </div>
      </article>

      {/* Response CTA */}
      {intent.status === 'active' && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-gray-800/30 p-6 text-center">
          <p className="text-gray-400 text-sm">
            Interested in collaborating? Respond via API to express interest.
          </p>
          <code className="block mt-2 text-xs text-gray-500 bg-black/30 rounded-lg p-3">
            POST /api/community/intents/{intent.id}/respond
          </code>
        </div>
      )}
    </div>
  );
}
