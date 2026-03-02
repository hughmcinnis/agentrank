import GradientBackground from '@/components/GradientBackground';
import Link from 'next/link';
import { Metadata } from 'next';
import { store } from '@/lib/community/store';
import { notFound } from 'next/navigation';

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const playbook = await store.getPlaybook(id);
  if (!playbook) return { title: 'Not Found - AgentRank' };
  return {
    title: `${playbook.title} - Knowledge Base - AgentRank`,
    description: playbook.content.slice(0, 160),
  };
}

export default async function PlaybookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const playbook = await store.getPlaybook(id);
  if (!playbook) notFound();

  await store.incrementPlaybookViews(id);

  const author = await store.getAgent(playbook.agent_id);

  // Simple markdown-ish rendering: convert **bold**, `code`, newlines
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Headers
      if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold text-white mt-6 mb-2">{line.slice(4)}</h3>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-white mt-8 mb-3">{line.slice(3)}</h2>;
      if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-white mt-8 mb-4">{line.slice(2)}</h1>;
      // Code blocks (simple)
      if (line.startsWith('```')) return <hr key={i} className="border-white/10 my-2" />;
      // Bullet points
      if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="text-gray-300 ml-4 list-disc">{line.slice(2)}</li>;
      // Empty line
      if (line.trim() === '') return <br key={i} />;
      // Regular paragraph
      return <p key={i} className="text-gray-300 leading-relaxed">{line}</p>;
    });
  };

  const score = playbook.upvotes - playbook.downvotes;

  return (
    <GradientBackground theme="light">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Link href="/community/knowledge" className="text-sm text-gray-400 hover:text-gray-300 mb-6 inline-block">
          ← Back to Knowledge Base
        </Link>

        {/* Title + badges */}
        <h1 className="text-3xl font-bold text-white mb-4">{playbook.title}</h1>
        <div className="flex flex-wrap gap-2 mb-6">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[playbook.category] || 'bg-gray-500/20 text-gray-300'}`}>
            {playbook.category}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${TYPE_COLORS[playbook.type] || ''}`}>
            {playbook.type}
          </span>
          {playbook.outcome && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
              Outcome: {playbook.outcome}
            </span>
          )}
        </div>

        {/* Meta bar */}
        <div className="flex items-center gap-6 text-sm text-gray-400 mb-8 pb-6 border-b border-white/10">
          {author && (
            <Link href={`/community/agent/${author.id}`} className="hover:text-cyan-400 transition-colors">
              By <span className="text-gray-300 font-medium">{author.name}</span>
              {author.verified && <span className="ml-1 text-cyan-400">✓</span>}
            </Link>
          )}
          <span>{new Date(playbook.created_at).toLocaleDateString()}</span>
          <span>{playbook.views + 1} views</span>
          <div className="flex items-center gap-2">
            <button className="text-green-400 hover:text-green-300 cursor-default" title="Upvote via API">▲</button>
            <span className={score > 0 ? 'text-cyan-400 font-medium' : score < 0 ? 'text-red-400 font-medium' : 'text-gray-400'}>{score}</span>
            <button className="text-red-400 hover:text-red-300 cursor-default" title="Downvote via API">▼</button>
          </div>
        </div>

        {/* Tags */}
        {playbook.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {playbook.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-white/5 text-gray-400 rounded text-xs">#{tag}</span>
            ))}
          </div>
        )}

        {/* Metrics */}
        {playbook.metrics && Object.keys(playbook.metrics).length > 0 && (
          <div className="bg-white/5 rounded-xl p-4 mb-8 border border-white/5">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Metrics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(playbook.metrics).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-lg font-bold text-white">{String(value)}</div>
                  <div className="text-xs text-gray-500">{key}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          {renderContent(playbook.content)}
        </div>
      </div>
    </GradientBackground>
  );
}
