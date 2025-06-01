import { Metadata } from 'next';
import GradientBackground from '@/components/GradientBackground';

export const metadata: Metadata = {
    title: 'Privacy Policy | Agent Rank',
    description: 'Privacy Policy for Agent Rank - Your curated directory of AI agents and tools.',
};

export default function PrivacyPage() {
    return (
        <GradientBackground>
            <div className="mx-auto max-w-3xl px-6 py-24">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent mb-8">
                    Privacy Policy
                </h1>

                <div className="prose prose-invert prose-cyan max-w-none">
                    <p className="text-gray-300 mb-8">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
                        <p className="text-gray-300">
                            Agent Rank is a curated directory that aggregates and presents information about AI agents and tools
                            created by third-party companies. We aim to provide accurate descriptions and comparisons of these
                            tools, but we do not own, operate, or directly represent any of the listed agents. This Privacy Policy
                            explains how we collect, use, disclose, and safeguard information when you visit our website.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Information About Listed Agents</h2>
                        <p className="text-gray-300 mb-4">
                            The information about AI agents displayed on our website is:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 mb-4">
                            <li>Collected from publicly available sources</li>
                            <li>Based on our research and analysis</li>
                            <li>Updated periodically to maintain accuracy</li>
                            <li>Not guaranteed to be complete or error-free</li>
                        </ul>
                        <p className="text-gray-300">
                            We encourage users to verify information directly with the respective AI agent providers
                            before making any decisions or purchases.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
                        <p className="text-gray-300 mb-4">
                            We collect minimal information that you voluntarily provide when you:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 mb-4">
                            <li>Contact us via email</li>
                            <li>Use our search functionality</li>
                            <li>Navigate through our directory</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Third-Party Links and Content</h2>
                        <p className="text-gray-300">
                            Our website contains links to third-party websites and information about third-party AI agents.
                            When you click on these links or interact with agent listings:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 mb-4">
                            <li>You will be directed to external websites we do not control</li>
                            <li>Your interactions with those sites are governed by their privacy policies</li>
                            <li>We are not responsible for their privacy practices or content</li>
                            <li>We recommend reviewing their privacy policies before providing any personal information</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">How We Use Information</h2>
                        <p className="text-gray-300 mb-4">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 mb-4">
                            <li>Maintain and improve our directory</li>
                            <li>Respond to your inquiries</li>
                            <li>Analyze how our directory is used</li>
                            <li>Update and verify agent information</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Cookies and Tracking</h2>
                        <p className="text-gray-300">
                            We use cookies and similar tracking technologies to track activity on our website and
                            maintain certain information. You can instruct your browser to refuse all cookies or
                            to indicate when a cookie is being sent.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Blog Content</h2>
                        <p className="text-gray-300">
                            While the agent listings and descriptions are aggregated from third-party sources,
                            the blog posts on our website are original content created by Agent Rank. These posts
                            are protected by copyright and may not be reproduced without permission.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                        <p className="text-gray-300">
                            If you have any questions about this Privacy Policy or would like to report inaccurate
                            information about an agent listing, please contact us at{' '}
                            <a href="mailto:hugh.e.mcinnis@gmail.com" className="text-cyan-400 hover:text-cyan-300">
                                hugh.e.mcinnis@gmail.com
                            </a>.
                        </p>
                    </section>
                </div>
            </div>
        </GradientBackground>
    );
} 