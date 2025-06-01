'use client';

import { blogPosts } from '@/data/blog-posts';
import { searchBlogPosts, filterPostsByCategory, filterPostsByTag, getAllCategories, getAllTags, formatDate } from '@/lib/blog-utils';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

export default function BlogPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const categories = useMemo(() => getAllCategories(blogPosts), []);
    const tags = useMemo(() => getAllTags(blogPosts), []);

    const filteredPosts = useMemo(() => {
        let posts = [...blogPosts];

        if (searchQuery) {
            posts = searchBlogPosts(posts, searchQuery);
        }

        if (selectedCategory) {
            posts = filterPostsByCategory(posts, selectedCategory);
        }

        if (selectedTag) {
            posts = filterPostsByTag(posts, selectedTag);
        }

        return posts;
    }, [searchQuery, selectedCategory, selectedTag]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            <div className="container mx-auto px-4 py-12">
                <div className="mb-12 text-center">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent leading-relaxed py-1">
                        Blog
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Discover the latest insights about AI tools, trends, and best practices
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="relative flex-grow">
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="search"
                                placeholder="Search posts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 hover:bg-white/10"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="relative min-w-[200px]">
                            <select
                                value={selectedCategory || ''}
                                onChange={(e) => setSelectedCategory(e.target.value || null)}
                                className="appearance-none w-full pl-4 pr-10 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 hover:bg-white/10 cursor-pointer"
                            >
                                <option value="" className="bg-gray-800">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category} className="bg-gray-800">{category}</option>
                                ))}
                            </select>
                            <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Tag Filter */}
                        <div className="relative min-w-[200px]">
                            <select
                                value={selectedTag || ''}
                                onChange={(e) => setSelectedTag(e.target.value || null)}
                                className="appearance-none w-full pl-4 pr-10 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 hover:bg-white/10 cursor-pointer"
                            >
                                <option value="" className="bg-gray-800">All Tags</option>
                                {tags.map(tag => (
                                    <option key={tag} value={tag} className="bg-gray-800">{tag}</option>
                                ))}
                            </select>
                            <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(searchQuery || selectedCategory || selectedTag) && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {searchQuery && (
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                                    Search: {searchQuery}
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="ml-2 hover:text-cyan-200"
                                    >
                                        <XMarkIcon className="h-4 w-4" />
                                    </button>
                                </span>
                            )}
                            {selectedCategory && (
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm bg-blue-500/10 text-blue-300 border border-blue-500/20">
                                    Category: {selectedCategory}
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className="ml-2 hover:text-blue-200"
                                    >
                                        <XMarkIcon className="h-4 w-4" />
                                    </button>
                                </span>
                            )}
                            {selectedTag && (
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm bg-teal-500/10 text-teal-300 border border-teal-500/20">
                                    Tag: {selectedTag}
                                    <button
                                        onClick={() => setSelectedTag(null)}
                                        className="ml-2 hover:text-teal-200"
                                    >
                                        <XMarkIcon className="h-4 w-4" />
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {filteredPosts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">No posts found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <article key={post.id} className="relative group">
                                <Link href={`/blog/${post.slug}`} className="block">
                                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
                                        {post.featuredImage && (
                                            <div className="relative h-48">
                                                <Image
                                                    src={post.featuredImage}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {post.categories.map((category) => (
                                                    <button
                                                        key={category}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setSelectedCategory(category);
                                                        }}
                                                        className="text-xs font-semibold bg-blue-500/10 text-blue-300 px-3 py-1 rounded-full border border-blue-500/20 hover:bg-blue-500/20 transition-colors relative z-10"
                                                    >
                                                        {category}
                                                    </button>
                                                ))}
                                            </div>
                                            <h2 className="text-xl font-semibold mb-2 text-gray-100 group-hover:text-cyan-400 transition-colors">
                                                {post.title}
                                            </h2>
                                            <p className="text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <span className="text-gray-400">{post.author}</span>
                                                <span className="text-gray-400">{formatDate(post.publishDate)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 