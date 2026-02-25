'use client';

import { useState } from 'react';
import { categories } from '@/lib/categories';
import GradientBackground from '@/components/GradientBackground';

export default function SubmitPage() {
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        description: '',
        categories: [] as string[],
        pricing: '',
        email: '',
        notes: '',
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleCategoryToggle = (categoryId: string) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.includes(categoryId)
                ? prev.categories.filter(c => c !== categoryId)
                : [...prev.categories, categoryId],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        try {
            const res = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMessage(data.error || 'Something went wrong.');
                setStatus('error');
                return;
            }

            setStatus('success');
            setFormData({ name: '', url: '', description: '', categories: [], pricing: '', email: '', notes: '' });
        } catch {
            setErrorMessage('Network error. Please try again.');
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <GradientBackground>
                <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-cyan-500/10 mb-6">
                            <span className="text-3xl">✅</span>
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent mb-4">
                            Submission Received!
                        </h1>
                        <p className="text-lg text-gray-300 mb-8">
                            Thanks! We&apos;ll review your submission and add it to the directory if it&apos;s a good fit.
                            We&apos;ll notify you by email once it&apos;s listed.
                        </p>
                        <button
                            onClick={() => setStatus('idle')}
                            className="rounded-xl bg-gray-800/50 backdrop-blur-xl border border-white/10 px-8 py-4 text-base font-semibold text-cyan-300 hover:bg-gray-700/50 hover:text-cyan-200 transition-all duration-300"
                        >
                            Submit Another
                        </button>
                    </div>
                </div>
            </GradientBackground>
        );
    }

    return (
        <GradientBackground>
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent mb-4">
                        Submit Your Agent
                    </h1>
                    <p className="text-lg text-gray-400 mb-12">
                        Have an AI agent or tool you&apos;d like listed on Agent Rank? Fill out the form below and we&apos;ll review it for inclusion.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Agent Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                Agent / Tool Name <span className="text-fuchsia-400">*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="block w-full rounded-xl border border-white/10 bg-gray-800/50 backdrop-blur-xl py-3 px-4 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all duration-300"
                                placeholder="e.g. ChatGPT, Cursor, Devin"
                            />
                        </div>

                        {/* Website URL */}
                        <div>
                            <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
                                Website URL <span className="text-fuchsia-400">*</span>
                            </label>
                            <input
                                id="url"
                                type="url"
                                required
                                value={formData.url}
                                onChange={e => setFormData(prev => ({ ...prev, url: e.target.value }))}
                                className="block w-full rounded-xl border border-white/10 bg-gray-800/50 backdrop-blur-xl py-3 px-4 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all duration-300"
                                placeholder="https://example.com"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                                Short Description / Tagline <span className="text-fuchsia-400">*</span>
                            </label>
                            <input
                                id="description"
                                type="text"
                                required
                                value={formData.description}
                                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="block w-full rounded-xl border border-white/10 bg-gray-800/50 backdrop-blur-xl py-3 px-4 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all duration-300"
                                placeholder="A brief description of what this agent does"
                            />
                        </div>

                        {/* Categories */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Categories
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => handleCategoryToggle(cat.id)}
                                        className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200 border ${
                                            formData.categories.includes(cat.id)
                                                ? 'border-cyan-400/50 bg-cyan-500/10 text-cyan-300'
                                                : 'border-white/10 bg-gray-800/30 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'
                                        }`}
                                    >
                                        <span className="mr-2">{cat.icon}</span>
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pricing */}
                        <div>
                            <label htmlFor="pricing" className="block text-sm font-medium text-gray-300 mb-2">
                                Pricing Info
                            </label>
                            <input
                                id="pricing"
                                type="text"
                                value={formData.pricing}
                                onChange={e => setFormData(prev => ({ ...prev, pricing: e.target.value }))}
                                className="block w-full rounded-xl border border-white/10 bg-gray-800/50 backdrop-blur-xl py-3 px-4 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all duration-300"
                                placeholder="e.g. Free, Freemium, $20/mo, Enterprise"
                            />
                        </div>

                        {/* Contact Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Contact Email <span className="text-fuchsia-400">*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                className="block w-full rounded-xl border border-white/10 bg-gray-800/50 backdrop-blur-xl py-3 px-4 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all duration-300"
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Notes */}
                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                                Additional Notes
                            </label>
                            <textarea
                                id="notes"
                                rows={4}
                                value={formData.notes}
                                onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                className="block w-full rounded-xl border border-white/10 bg-gray-800/50 backdrop-blur-xl py-3 px-4 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all duration-300 resize-none"
                                placeholder="Anything else we should know?"
                            />
                        </div>

                        {status === 'error' && (
                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                                {errorMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="w-full rounded-xl bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 border border-white/10 px-8 py-4 text-base font-semibold text-cyan-300 hover:from-cyan-500/30 hover:to-fuchsia-500/30 hover:text-cyan-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {status === 'submitting' ? 'Submitting...' : 'Submit for Review'}
                        </button>
                    </form>
                </div>
            </div>
        </GradientBackground>
    );
}
