import { Metadata } from 'next';
import GradientBackground from '@/components/GradientBackground';

export const metadata: Metadata = {
    title: 'Terms of Service | Agent Rank',
    description: 'Terms of Service for Agent Rank - Your curated directory of AI agents and tools.',
};

export default function TermsPage() {
    return (
        <GradientBackground>
            <div className="mx-auto max-w-3xl px-6 py-24">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent mb-8">
                    Terms of Service
                </h1>

                <div className="prose prose-invert prose-cyan max-w-none">
                    <p className="text-gray-300 mb-8">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Agreement to Terms</h2>
                        <p className="text-gray-300">
                            By accessing or using Agent Rank, you agree to be bound by these Terms of Service.
                            If you disagree with any part of the terms, you may not access the website.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Nature of Our Service</h2>
                        <p className="text-gray-300 mb-4">
                            Agent Rank is an independent directory service that:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 mb-4">
                            <li>Aggregates and presents information about third-party AI agents and tools</li>
                            <li>Does not own, operate, or directly represent any of the listed agents</li>
                            <li>Provides descriptions and comparisons based on publicly available information</li>
                            <li>Maintains editorial independence in our reviews and comparisons</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Content Accuracy</h2>
                        <p className="text-gray-300 mb-4">
                            While we strive for accuracy in our directory:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 mb-4">
                            <li>Information about listed agents is collected from public sources and may not be complete</li>
                            <li>Pricing, features, and other details may change without our knowledge</li>
                            <li>Users should verify all information directly with the agent providers</li>
                            <li>We welcome corrections and updates via email</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
                        <p className="text-gray-300 mb-4">
                            Our intellectual property rights extend to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 mb-4">
                            <li>Original blog content created by Agent Rank</li>
                            <li>Our website design and layout</li>
                            <li>Our branding and logos</li>
                        </ul>
                        <p className="text-gray-300">
                            Agent listings and descriptions are based on publicly available information and may contain
                            trademarks and content owned by their respective companies. These are used for identification
                            purposes only and do not imply endorsement.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Third-Party Links and Services</h2>
                        <p className="text-gray-300 mb-4">
                            When using our directory:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 mb-4">
                            <li>Links to agent websites are provided for your convenience</li>
                            <li>We are not responsible for any transactions with listed agents</li>
                            <li>Your use of third-party services is governed by their terms</li>
                            <li>We do not guarantee availability or quality of listed services</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Disclaimer of Warranties</h2>
                        <p className="text-gray-300">
                            The directory is provided "as is" without warranties of any kind. We do not guarantee
                            the accuracy, completeness, or reliability of any agent listings or descriptions. We are
                            not liable for any decisions made based on information found in our directory.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
                        <p className="text-gray-300">
                            Agent Rank shall not be liable for any damages arising from:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 mb-4">
                            <li>Use of or inability to use listed AI agents</li>
                            <li>Inaccuracies in agent listings or descriptions</li>
                            <li>Transactions with listed service providers</li>
                            <li>Changes in agent features or pricing</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Updates to Terms</h2>
                        <p className="text-gray-300">
                            We may update these terms as our directory evolves. Continued use of the website
                            following changes constitutes acceptance of the updated terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                        <p className="text-gray-300">
                            If you have any questions about these Terms of Service or would like to report
                            inaccurate information, please contact us at{' '}
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