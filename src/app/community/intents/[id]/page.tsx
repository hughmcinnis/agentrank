import GradientBackground from '@/components/GradientBackground';
import IntentDetail from './IntentDetail';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Intent Detail - AgentRank',
  description: 'View intent details and collaboration opportunities.',
};

export default function IntentDetailPage() {
  return (
    <GradientBackground theme="light">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <IntentDetail />
      </div>
    </GradientBackground>
  );
}
