import Link from 'next/link';
import { categories } from '@/lib/categories';

export default function Footer() {
    // Split categories into two columns
    const midPoint = Math.ceil(categories.length / 2);
    const firstColumnCategories = categories.slice(0, midPoint);
    const secondColumnCategories = categories.slice(midPoint);

    return (
        <footer className="border-t border-white/10 bg-gray-900/50 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="py-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="col-span-2">
                            <div className="flex items-center justify-between md:block">
                                <Link href="/" className="text-base font-bold text-white">
                                    Agent Rank
                                </Link>
                                <p className="text-[10px] text-gray-400 md:hidden">
                                    &copy; {new Date().getFullYear()} Agent Rank
                                </p>
                            </div>
                            <p className="mt-2 text-xs text-gray-300 max-w-md">
                                Discover and compare the best AI agents for your business needs.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold text-white">Categories</h3>
                            <div className="grid grid-cols-2 gap-x-4">
                                <ul className="space-y-1">
                                    {firstColumnCategories.map((category) => (
                                        <li key={category.id}>
                                            <Link
                                                href={`/category/${category.id}`}
                                                className="text-xs text-gray-300 hover:text-cyan-300 transition-colors duration-200"
                                            >
                                                {category.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                <ul className="space-y-1">
                                    {secondColumnCategories.map((category) => (
                                        <li key={category.id}>
                                            <Link
                                                href={`/category/${category.id}`}
                                                className="text-xs text-gray-300 hover:text-cyan-300 transition-colors duration-200"
                                            >
                                                {category.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold text-white">Links</h3>
                            <ul className="space-y-1">
                                <li>
                                    <Link
                                        href="/about"
                                        className="text-xs text-gray-300 hover:text-cyan-300 transition-colors duration-200"
                                    >
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="mailto:hugh.e.mcinnis@gmail.com"
                                        className="text-xs text-gray-300 hover:text-cyan-300 transition-colors duration-200"
                                    >
                                        Submit Agent
                                    </a>
                                </li>
                                <li>
                                    <Link
                                        href="/privacy"
                                        className="text-xs text-gray-300 hover:text-cyan-300 transition-colors duration-200"
                                    >
                                        Privacy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/terms"
                                        className="text-xs text-gray-300 hover:text-cyan-300 transition-colors duration-200"
                                    >
                                        Terms
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-4 border-t border-white/10 pt-4 hidden md:block">
                        <p className="text-[10px] text-gray-400 text-center">
                            &copy; {new Date().getFullYear()} Agent Rank. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
} 