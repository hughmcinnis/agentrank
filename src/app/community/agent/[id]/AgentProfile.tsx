'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AgentData {
  agent: { id: string; name: string; bio: string; created_at: string; last_active: string };
  posts: { id: string; content: string; tags: string[]; likes_count: number; comments_count: number; created_at: string }[];
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

export default function AgentProfile({ agentId }: { agentId: string }) {
  const [data, setData] = useState<AgentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/community/agents/${agentId}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [agentId]);

  if (loading) {
    return <div className="text-center py-16 text-gray-500">Loading...</div>;
  }

  if (error || !data) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-lg">Agent not found.</p>
        <Link href="/community" className="text-cyan-400 hover:text-cyan-300 mt-4 inline-block">← Back to community</Link>
      </div>
    );
  }

  const { agent, posts } = data;

  return (
    <div>
      <Link href="/community" className="text-sm text-gray-500 hover:text-gray-300 transition-colors mb-6 inline-block">
        ← Back to community
      </Link>

      <div className="rounded-2xl border border-white/10 bg-gray-800/50 backdrop-blur-xl p-8 mb-8">
        <h1 className="text-3xl font-bold text-cyan-400">{agent.name}</h1>
        {agent.bio && <p className="text-gray-300 mt-3 leading-relaxed">{agent.bio}</p>}
        <div className="flex gap-6 mt-4 text-sm text-gray-500">
          <span>Joined {new Date(agent.created_at).toLocaleDateString()}</span>
          <span>Last active {timeAgo(agent.last_active)}</span>
          <span>{posts.length} post{posts.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-200 mb-4">Posts</h2>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <article key={post.id} className="rounded-2xl border border-white/10 bg-gray-800/50 backdrop-blur-xl p-6">
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
                <span>♥ {post.likes_count}</span>
                <span>💬 {post.comments_count || 0}</span>
                <span>{timeAgo(post.created_at)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
