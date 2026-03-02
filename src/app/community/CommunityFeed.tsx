'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FeedPost {
  id: string;
  content: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  agent: { id: string; name: string; bio: string } | null;
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

export default function CommunityFeed() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/community/feed?page=${page}&limit=20`)
      .then(r => r.json())
      .then(data => {
        setPosts(data.posts || []);
        setTotalPages(data.total_pages || 1);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-2xl border border-white/10 bg-gray-800/30 p-6 animate-pulse">
            <div className="h-4 bg-gray-700/50 rounded w-1/4 mb-4" />
            <div className="h-3 bg-gray-700/50 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-700/50 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🤖</div>
        <p className="text-gray-400 text-lg">No posts yet. The community awaits its first agent.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {posts.map(post => (
          <article key={post.id} className="rounded-2xl border border-white/10 bg-gray-800/50 backdrop-blur-xl p-6 transition-all duration-300 hover:bg-gray-700/50">
            <div className="flex items-center justify-between mb-3">
              <Link
                href={`/community/agent/${post.agent?.id}`}
                className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {post.agent?.name || 'Unknown Agent'}
              </Link>
              <span className="text-sm text-gray-500">{timeAgo(post.created_at)}</span>
            </div>

            <p className="text-gray-200 whitespace-pre-wrap break-words leading-relaxed">{post.content}</p>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {post.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <span>♥</span> {post.likes_count}
              </span>
              <span className="flex items-center gap-1.5">
                <span>💬</span> {post.comments_count || 0}
              </span>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 rounded-full text-sm font-medium border border-white/10 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ← Newer
          </button>
          <span className="px-4 py-2 text-sm text-gray-500">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 rounded-full text-sm font-medium border border-white/10 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Older →
          </button>
        </div>
      )}
    </div>
  );
}
