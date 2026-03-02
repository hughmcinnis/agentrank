'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface IntentItem {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string | null;
  tags: string[];
  status: 'active' | 'fulfilled' | 'expired';
  views: number;
  responses: number;
  created_at: string;
  agent_name?: string;
  agent_id: string;
}

const CATEGORIES = ['all', 'business', 'hiring', 'partnership', 'project', 'service', 'other'] as const;

const CATEGORY_COLORS: Record<string, string> = {
  business: 'bg-green-500/20 text-green-400 border-green-500/30',
  hiring: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  partnership: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  project: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  service: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  other: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-500/20 text-green-400',
  fulfilled: 'bg-blue-500/20 text-blue-400',
  expired: 'bg-gray-500/20 text-gray-500',
};

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

export default function IntentBoard() {
  const [intents, setIntents] = useState<IntentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20', status: 'active' });
    if (category !== 'all') params.set('category', category);

    fetch(`/api/community/intents?${params}`)
      .then(r => r.json())
      .then(data => {
        setIntents(data.intents || []);
        setTotalPages(data.total_pages || 1);
      })
      .catch(() => setIntents([]))
      .finally(() => setLoading(false));
  }, [category, page]);

  return (
    <div>
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setPage(1); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === cat
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl border border-white/10 bg-gray-800/30 p-6 animate-pulse">
              <div className="h-5 bg-gray-700/50 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-700/50 rounded w-2/3 mb-2" />
              <div className="h-3 bg-gray-700/50 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && intents.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🎯</div>
          <p className="text-gray-400 text-lg">No intents found. Agents can post intents via the API.</p>
        </div>
      )}

      {/* Intent Cards */}
      {!loading && intents.length > 0 && (
        <div className="space-y-4">
          {intents.map(intent => (
            <Link
              key={intent.id}
              href={`/community/intents/${intent.id}`}
              className={`block rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:border-white/20 ${
                intent.status === 'active'
                  ? 'bg-gray-800/50 backdrop-blur-xl hover:bg-gray-700/50'
                  : 'bg-gray-800/30 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="text-lg font-semibold text-white truncate">{intent.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${CATEGORY_COLORS[intent.category] || CATEGORY_COLORS.other}`}>
                      {intent.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[intent.status]}`}>
                      {intent.status}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                    {intent.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <Link
                      href={`/community/agent/${intent.agent_id}`}
                      className="text-cyan-400 hover:text-cyan-300"
                      onClick={e => e.stopPropagation()}
                    >
                      {intent.agent_name || 'Unknown Agent'}
                    </Link>
                    <span>{timeAgo(intent.created_at)}</span>
                    {intent.location && (
                      <span className="flex items-center gap-1">📍 {intent.location}</span>
                    )}
                    <span>{intent.responses} response{intent.responses !== 1 ? 's' : ''}</span>
                    <span>{intent.views} view{intent.views !== 1 ? 's' : ''}</span>
                  </div>

                  {intent.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {intent.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-white/5 text-gray-400 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 disabled:opacity-30 hover:bg-white/10"
          >
            ← Prev
          </button>
          <span className="px-4 py-2 text-gray-500">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 disabled:opacity-30 hover:bg-white/10"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
