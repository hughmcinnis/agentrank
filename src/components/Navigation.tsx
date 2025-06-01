'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { ChartBar } from '@phosphor-icons/react';
import { categories } from '@/lib/categories';
import { cn } from '@/lib/utils';
import { FormEvent, useState, useEffect, useRef } from 'react';
import { useModal } from '@/contexts/ModalContext';
import { Audiowide } from 'next/font/google';

const audiowide = Audiowide({ subsets: ["latin"], weight: ["400"] });

export default function Navigation() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { isModalOpen } = useModal();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowCategoryDropdown(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    if (isModalOpen) return null;

    return (
        <nav className={cn(
            "sticky top-0 z-50 w-full transition-all duration-300",
            isScrolled ? "bg-gray-900/50 backdrop-blur-xl" : "bg-gray-900"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex items-center group">
                            <div className="relative">
                                <div className="text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors duration-300">
                                    <Image
                                        src="/images/svg/ranking.svg"
                                        alt="AgentRank Logo"
                                        width={32}
                                        height={32}
                                        className="mr-2 transform group-hover:scale-110 transition-all duration-300"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-fuchsia-400/20 rounded-full blur-xl scale-0 group-hover:scale-150 transition-transform duration-300" />
                            </div>
                            <span className={cn(
                                audiowide.className,
                                "text-xl relative"
                            )}>
                                <span className="text-[22px] text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">A</span>
                                <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">gent</span>
                                <span className="text-[22px] text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors duration-300">R</span>
                                <span className="text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors duration-300">ank</span>
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-8">
                        <form onSubmit={handleSearch} className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                            <input
                                type="search"
                                placeholder="Search agents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-64 rounded-full border border-white/10 bg-gray-800/50 backdrop-blur-xl py-2 pl-10 pr-3 text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all duration-300 hover:bg-gray-700/50 shadow-inner"
                            />
                        </form>

                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:text-fuchsia-400 hover:bg-gray-800/50 rounded-full transition-all duration-300"
                            >
                                Categories
                                <ChevronDownIcon className={cn(
                                    "ml-1 h-5 w-5 transition-transform duration-200",
                                    showCategoryDropdown ? "transform rotate-180" : ""
                                )} />
                            </button>

                            {showCategoryDropdown && (
                                <div className="absolute left-0 mt-2 w-56 rounded-xl bg-gray-800/90 backdrop-blur-xl border border-white/10 shadow-lg py-2 z-50">
                                    {categories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={`/category/${category.id}`}
                                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-fuchsia-400 transition-all duration-200"
                                            onClick={() => setShowCategoryDropdown(false)}
                                        >
                                            <span className="mr-2">{category.icon}</span>
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link
                            href="/blog"
                            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-fuchsia-400 hover:bg-gray-800/50 rounded-full transition-all duration-300"
                        >
                            Blog
                        </Link>

                        <Link
                            href="/about"
                            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-fuchsia-400 hover:bg-gray-800/50 rounded-full transition-all duration-300"
                        >
                            About
                        </Link>
                    </div>

                    <div className="flex items-center">
                        <Link
                            href="mailto:hugh.e.mcinnis@gmail.com"
                            className="group relative inline-flex items-center px-6 py-2 rounded-lg text-sm font-medium text-white bg-fuchsia-500 hover:bg-fuchsia-400 transition-all duration-300"
                        >
                            <span className="relative z-10">Submit Agent</span>
                            <div className="absolute inset-0 bg-cyan-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0" />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
} 