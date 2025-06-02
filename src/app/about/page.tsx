import { Metadata } from 'next';
import GradientBackground from '@/components/GradientBackground';

export const metadata: Metadata = {
    title: 'About | Agent Rank',
    description: 'Learn more about Agent Rank - Your curated directory of AI agents and tools.',
};

export default function AboutPage() {
    return (
        <GradientBackground>
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent mb-8">
                        About Agent Rank
                    </h1>

                    <div className="prose prose-invert prose-cyan max-w-none">
                        <p className="text-xl text-gray-300 mb-12">
                            Agent Rank is your go-to directory for discovering and comparing AI agents.
                            We curate the best AI-powered tools and assistants to help you make informed decisions
                            for your business needs.
                        </p>

                        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mt-12 mb-4">
                            Our Mission
                        </h2>
                        <p className="text-gray-400 mb-8">
                            Our mission is to help businesses and individuals navigate the rapidly evolving
                            landscape of AI tools. We believe in making it easy to find the right AI agent
                            for your specific needs, saving you time and resources in the process.
                        </p>

                        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mt-12 mb-4">
                            What We Offer
                        </h2>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-center">
                                <span className="text-cyan-400 mr-2">•</span>
                                Curated selection of high-quality AI agents
                            </li>
                            <li className="flex items-center">
                                <span className="text-cyan-400 mr-2">•</span>
                                Detailed information and comparisons
                            </li>
                            <li className="flex items-center">
                                <span className="text-cyan-400 mr-2">•</span>
                                Regular updates with new tools
                            </li>
                            <li className="flex items-center">
                                <span className="text-cyan-400 mr-2">•</span>
                                Categorized listings for easy discovery
                            </li>
                            <li className="flex items-center">
                                <span className="text-cyan-400 mr-2">•</span>
                                Unbiased reviews and information
                            </li>
                        </ul>

                        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mt-12 mb-4">
                            Submit Your Agent
                        </h2>
                        <p className="text-gray-400 mb-8">
                            Are you building an AI agent? We&apos;d love to feature it in our directory.
                            Submit your agent for review and reach thousands of potential users.
                        </p>

                        <div className="mt-8">
                            <a
                                href="mailto:hugh.e.mcinnis@gmail.com"
                                className="inline-flex items-center justify-center rounded-xl bg-gray-900/50 backdrop-blur-xl border border-white/10 px-8 py-4 text-base font-semibold text-cyan-300 hover:bg-gray-800/50 hover:text-cyan-200 transition-all duration-300"
                            >
                                Submit Your Agent
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </GradientBackground>
    );
} 