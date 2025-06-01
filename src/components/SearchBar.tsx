'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Agent } from '@/data/agents';
import { searchAgents } from '@/lib/search';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { truncate } from '@/lib/utils';

export default function SearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Agent[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const handleSearch = useCallback((searchQuery: string) => {
        const searchResults = searchAgents(searchQuery);
        setResults(searchResults.slice(0, 5));
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query) {
                handleSearch(query);
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, handleSearch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative w-full max-w-lg">
            <form onSubmit={handleSubmit}>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        type="search"
                        placeholder="Search AI agents..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        className="block w-full rounded-lg border border-white/10 bg-gray-800/50 backdrop-blur-xl py-2.5 pl-10 pr-3 text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent sm:text-sm sm:leading-6"
                    />
                </div>
            </form>

            <AnimatePresence>
                {isOpen && results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 mt-2 w-full rounded-lg bg-gray-800/90 backdrop-blur-xl py-2 shadow-lg ring-1 ring-white/10"
                    >
                        {results.map((agent) => (
                            <Link
                                key={agent.id}
                                href={`/agents/${agent.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-2 hover:bg-gray-700/50"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        {agent.logo ? (
                                            <img
                                                src={agent.logo}
                                                alt={agent.name}
                                                className="h-6 w-6 rounded-full"
                                            />
                                        ) : (
                                            <div className="h-6 w-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                                <span className="text-cyan-300 text-xs font-medium">
                                                    {agent.name.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-100">
                                            {agent.name}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {truncate(agent.tagline, 60)}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {query && (
                            <button
                                onClick={handleSubmit}
                                className="mt-1 block w-full px-4 py-2 text-sm text-cyan-300 hover:bg-gray-700/50"
                            >
                                View all results for "{query}"
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 