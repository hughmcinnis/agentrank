import { agents } from '@/data/agents';
import { categories } from '@/lib/categories';
import { getRecentAgents } from '@/lib/search';
import AgentGrid from '@/components/AgentGrid';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';
import GradientBackground from '@/components/GradientBackground';

export default function Home() {
  const recentAgents = getRecentAgents(6);

  return (
    <GradientBackground theme="light">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-white pb-1">
              Discover the Best AI Agents
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Find and compare AI-powered tools and assistants to supercharge your productivity.
              Our curated directory helps you choose the perfect AI agent for your needs.
            </p>
            <div className="mt-10 flex justify-center">
              <div className="w-full max-w-xl">
                <SearchBar />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-24 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent sm:text-4xl">
              Browse by Category
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Explore AI agents by their primary function
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="group relative rounded-2xl border border-white/10 bg-gray-800/50 backdrop-blur-xl p-8 text-center transition-all duration-300 hover:bg-gray-700/50"
              >
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors duration-300 mb-6">
                  <span className="text-3xl opacity-90 group-hover:opacity-100">{category.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-100 mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-400 group-hover:text-gray-300">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Agents Section */}
      <div className="py-24 relative">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <AgentGrid
            agents={recentAgents}
            title="Recently Added"
            description="Check out the latest AI agents added to our directory"
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative">
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent sm:text-4xl">
              Want to list your AI agent?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Submit your AI agent to our directory and reach thousands of potential users.
            </p>
            <div className="mt-10 flex items-center justify-center">
              <a
                href="mailto:hugh.e.mcinnis@gmail.com"
                className="rounded-xl bg-gray-800/50 backdrop-blur-xl border border-white/10 px-8 py-4 text-base font-semibold text-cyan-300 hover:bg-gray-700/50 hover:text-cyan-200 transition-all duration-300"
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
