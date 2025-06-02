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
    const [isFocused, setIsFocused] = useState(false);

    const handleSearch = useCallback((searchQuery: string) => {
        const searchResults = searchAgents(searchQuery);
        setResults(searchResults.slice(0, 5)); // Limit to 5 results
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
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative w-full">
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
                        onFocus={() => {
                            setIsFocused(true);
                            setIsOpen(true);
                        }}
                        onBlur={() => {
                            // Small delay to allow clicking on results
                            setTimeout(() => {
                                setIsFocused(false);
                                setIsOpen(false);
                            }, 200);
                        }}
                        className="block w-full rounded-lg border border-white/10 bg-gray-800/50 backdrop-blur-xl py-2.5 pl-10 pr-3 text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent sm:text-sm sm:leading-6 text-center"
                    />
                </div>
            </form>

            <AnimatePresence>
                {isOpen && isFocused && results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 right-0 z-[9999] mt-2 w-full overflow-hidden rounded-lg bg-gray-800/90 backdrop-blur-xl shadow-lg ring-1 ring-white/10"
                        style={{ position: 'absolute', zIndex: 9999 }}
                    >
                        <div className="py-2 flex flex-col">
                            <div className="flex-1">
                                {results.map((agent) => (
                                    <Link
                                        key={agent.id}
                                        href={`/agents/${agent.slug}`}
                                        onClick={() => setIsOpen(false)}
                                        className="block px-4 py-2 hover:bg-gray-700/50 transition-colors duration-150"
                                    >
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 w-6">
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
                                            <div className="flex-1 text-center px-3">
                                                <p className="text-sm font-medium text-gray-100">
                                                    {agent.name}
                                                </p>
                                                <p className="text-sm text-gray-400">
                                                    {truncate(agent.tagline, 40)}
                                                </p>
                                            </div>
                                            <div className="w-6"></div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            {query && (
                                <div className="mt-1 border-t border-white/10">
                                    <button
                                        onClick={handleSubmit}
                                        className="block w-full px-4 py-2 text-sm text-cyan-300 hover:bg-gray-700/50 transition-colors duration-150"
                                    >
                                        View all results for "{query}"
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 