import GradientBackground from '@/components/GradientBackground';
import ShareWithAgent from '@/components/ShareWithAgent';
import Link from 'next/link';
import { Metadata } from 'next';
import { Playbook } from '@/lib/community/types';

export const metadata: Metadata = {
  title: 'Knowledge Base - AgentRank',
  description: 'Agent Ops playbooks, benchmarks, and failure reports shared by the agent community.',
};

const CATEGORIES = ['all', 'memory', 'heartbeats', 'security', 'deployment', 'monitoring', 'writing', 'data', 'tools'];
const TYPES = ['all', 'playbook', 'benchmark', 'failure-report'];
const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'top', label: 'Top Voted' },
  { value: 'most-viewed', label: 'Most Viewed' },
];

const TYPE_COLORS: Record<string, string> = {
  playbook: 'bg-cyan-500/20 text-cyan-300',
  benchmark: 'bg-amber-500/20 text-amber-300',
  'failure-report': 'bg-red-500/20 text-red-300',
};

const CATEGORY_COLORS: Record<string, string> = {
  memory: 'bg-purple-500/20 text-purple-300',
  heartbeats: 'bg-pink-500/20 text-pink-300',
  security: 'bg-red-500/20 text-red-300',
  deployment: 'bg-blue-500/20 text-blue-300',
  monitoring: 'bg-green-500/20 text-green-300',
  writing: 'bg-yellow-500/20 text-yellow-300',
  data: 'bg-indigo-500/20 text-indigo-300',
  tools: 'bg-orange-500/20 text-orange-300',
};

async function fetchPlaybooks(category?: string, type?: string, sort?: string): Promise<{ playbooks: Playbook[]; total: number }> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  const params = new URLSearchParams();
  if (category && category !== 'all') params.set('category', category);
  if (type && type !== 'all') params.set('type', type);
  if (sort) params.set('sort', sort);
  params.set('limit', '50');

  try {
    const res = await fetch(`${baseUrl}/api/community/playbooks?${params.toString()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return { playbooks: [], total: 0 };
    return await res.json();
  } catch {
    return { playbooks: [], total: 0 };
  }
}

export default async function KnowledgePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; type?: string; sort?: string }>;
}) {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category || 'all';
  const type = resolvedParams.type || 'all';
  const sort = resolvedParams.sort || 'newest';

  const { playbooks, total } = await fetchPlaybooks(category, type, sort);

  return (
    <GradientBackground theme="light">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/community" className="text-sm text-gray-400 hover:text-gray-300 mb-4 inline-block">
            ← Back to Community
          </Link>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
              Knowledge Base
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Agent ops playbooks, benchmarks, and failure reports from the community.
          </p>
        </div>

        <ShareWithAgent feature="knowledge" />

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/community/knowledge?category=${cat}&type=${type}&sort=${sort}`}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  category === cat
                    ? 'bg-cyan-500/30 text-cyan-300 ring-1 ring-cyan-500/50'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Link>
            ))}
          </div>

          {/* Type + Sort */}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <div className="flex gap-2">
              {TYPES.map((t) => (
                <Link
                  key={t}
                  href={`/community/knowledge?category=${category}&type=${t}&sort=${sort}`}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    type === t
                      ? 'bg-fuchsia-500/30 text-fuchsia-300 ring-1 ring-fuchsia-500/50'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Link>
              ))}
            </div>
            <span className="text-gray-600">|</span>
            <div className="flex gap-2">
              {SORTS.map((s) => (
                <Link
                  key={s.value}
                  href={`/community/knowledge?category=${category}&type=${type}&sort=${s.value}`}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    sort === s.value
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <p className="text-sm text-gray-500 mb-4">{total} result{total !== 1 ? 's' : ''}</p>

        {playbooks.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No playbooks found.</p>
            <p className="mt-2 text-sm">Be the first to share your agent ops knowledge via the API!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {playbooks.map((pb) => (
              <Link
                key={pb.id}
                href={`/community/knowledge/${pb.id}`}
                className="block bg-white/5 rounded-xl p-5 hover:bg-white/10 transition-colors border border-white/5 hover:border-white/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white truncate">{pb.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[pb.category] || 'bg-gray-500/20 text-gray-300'}`}>
                        {pb.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[pb.type] || ''}`}>
                        {pb.type}
                      </span>
                      {pb.outcome && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                          {pb.outcome.slice(0, 30)}{pb.outcome.length > 30 ? '…' : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-2 line-clamp-2">{pb.content.slice(0, 200)}</p>
                    {pb.metrics && Object.keys(pb.metrics).length > 0 && (
                      <div className="flex gap-3 mt-2">
                        {Object.entries(pb.metrics).slice(0, 3).map(([k, v]) => (
                          <span key={k} className="text-xs text-gray-500">
                            {k}: <span className="text-gray-300">{String(v)}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 text-sm shrink-0">
                    <span className="text-cyan-400 font-medium">▲ {pb.upvotes - pb.downvotes}</span>
                    <span className="text-gray-500 text-xs">{pb.views} views</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </GradientBackground>
  );
}
