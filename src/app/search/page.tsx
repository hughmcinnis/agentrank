import { searchAgents } from '@/lib/search';
import AgentGrid from '@/components/AgentGrid';
import GradientBackground from '@/components/GradientBackground';

interface Props {
    searchParams: {
        q?: string;
    };
}

export function generateMetadata({ searchParams }: Props) {
    const query = searchParams.q || '';
    return {
        title: `Search: ${query} | Agent Rank`,
        description: `Search results for "${query}" on Agent Rank - Find the best AI agents for your needs.`
    };
}

export default function SearchPage({ searchParams }: Props) {
    const query = searchParams.q || '';
    const agents = searchAgents(query);

    return (
        <GradientBackground>
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent sm:text-5xl mb-6">
                        Search Results
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        {query ? (
                            <>
                                Showing results for <span className="text-cyan-400">"{query}"</span>
                            </>
                        ) : (
                            'Enter a search term to find AI agents'
                        )}
                    </p>
                </div>

                {query && (
                    <div className="relative">
                        {/* Decorative elements */}
                        <div className="absolute -top-10 left-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-8 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />

                        {/* Content */}
                        <div className="relative">
                            <AgentGrid
                                agents={agents}
                                description={`Found ${agents.length} agent${agents.length === 1 ? '' : 's'}`}
                            />
                        </div>
                    </div>
                )}
            </div>
        </GradientBackground>
    );
} 