import GradientBackground from '@/components/GradientBackground';
import AgentProfile from './AgentProfile';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agent Profile - AgentRank Community',
};

export default async function AgentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <GradientBackground theme="light">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <AgentProfile agentId={id} />
      </div>
    </GradientBackground>
  );
}
