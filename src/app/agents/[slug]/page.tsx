import { notFound } from 'next/navigation';
import { agents } from '@/data/agents';
import { getCategoryById } from '@/lib/categories';
import { formatDate } from '@/lib/utils';
import { getRelatedAgents } from '@/lib/search';
import AgentGrid from '@/components/AgentGrid';
import ImageCarousel from '@/components/ImageCarousel';
import { Metadata } from 'next';
import GradientBackground from '@/components/GradientBackground';
import Image from 'next/image';

type Props = {
    params: { slug: string }
}

export async function generateMetadata({
    params
}: Props): Promise<Metadata> {
    const slug = params?.slug;
    const agent = agents.find((a) => a.slug === slug);
    if (!agent) return {};

    return {
        title: `${agent.name} | Agent Rank`,
        description: agent.description,
        openGraph: {
            title: `${agent.name} | Agent Rank`,
            description: agent.description,
            type: 'website'
        },
        twitter: {
            card: 'summary_large_image',
            title: `${agent.name} | Agent Rank`,
            description: agent.description
        }
    };
}

export default function AgentPage({ params }: Props) {
    const { slug } = params;
    const agent = agents.find((a) => a.slug === slug);

    if (!agent) {
        notFound();
    }

    const relatedAgents = getRelatedAgents(agent);

    // Prepare items for the carousel
    const carouselItems = [
        ...(agent.screenshots ? agent.screenshots.map(screenshot => ({
            type: 'image' as const,
            url: screenshot,
            alt: `${agent.name} screenshot`
        })) : []),
        ...(agent.videos ? agent.videos.map(video => ({
            type: 'video' as const,
            url: video.url || `https://customer-7w6ectfrlaic6wci.cloudflarestream.com/${video.videoUid}/iframe`,
            alt: video.alt || `${agent.name} video`,
            videoUid: video.videoUid
        })) : [])
    ];

    return (
        <GradientBackground theme="light">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-24 pb-128">
                {carouselItems.length > 0 ? (
                    <div className="mb-12">
                        <ImageCarousel items={carouselItems} />
                    </div>
                ) : null}

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
                    {/* Left Column - Agent Info */}
                    <div>
                        <div className="flex items-center space-x-4 mb-6">
                            {agent.logo ? (
                                <div className="w-24 h-24 flex items-center justify-center">
                                    <Image
                                        src={agent.logo}
                                        alt={`${agent.name} logo`}
                                        width={48}
                                        height={48}
                                        className="w-12 h-12 rounded-lg object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                    <span className="text-cyan-300 font-semibold text-2xl">
                                        {agent.name.charAt(0)}
                                    </span>
                                </div>
                            )}
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">{agent.name}</h1>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {agent.categories.map(categoryId => {
                                        const category = getCategoryById(categoryId);
                                        return category && (
                                            <span key={categoryId} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                                                <span className="mr-1">{category.icon}</span>
                                                {category.name}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <p className="text-xl text-gray-300 mb-8">{agent.tagline}</p>

                        <div className="prose prose-invert max-w-none">
                            <h2 className="text-xl font-semibold mb-4 text-white">About</h2>
                            <p className="text-gray-300">{agent.description}</p>

                            <h2 className="text-xl font-semibold mt-8 mb-4 text-white">Features</h2>
                            <ul className="space-y-2">
                                {agent.features.map((feature, index) => (
                                    <li key={index} className="flex items-center text-gray-300">
                                        <span className="mr-2 text-cyan-400">•</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <h2 className="text-xl font-semibold mt-8 mb-4 text-white">Use Cases</h2>
                            <ul className="space-y-2">
                                {agent.useCases.map((useCase, index) => (
                                    <li key={index} className="flex items-center text-gray-300">
                                        <span className="mr-2 text-cyan-400">•</span>
                                        {useCase}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column - Action Card */}
                    <div className="mt-12 lg:mt-0">
                        <div className="sticky top-24">
                            <div className="rounded-2xl border border-white/10 bg-gray-900/50 backdrop-blur-xl p-8">
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-2 text-white">Pricing</h3>
                                    <p className="text-gray-300">{agent.pricing}</p>
                                </div>

                                <a
                                    href={agent.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 text-gray-900 text-center py-3 px-4 rounded-lg font-semibold transition-all duration-300"
                                >
                                    Visit Website
                                </a>

                                <div className="mt-6 text-sm text-gray-400">
                                    <p>Added on {formatDate(agent.addedDate)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Agents */}
                {relatedAgents.length > 0 && (
                    <div className="mt-16">
                        <AgentGrid
                            agents={relatedAgents}
                            title="Similar Agents"
                            description={`Other agents you might like`}
                        />
                    </div>
                )}
            </div>
        </GradientBackground>
    );
} 