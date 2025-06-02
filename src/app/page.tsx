import { agents } from '@/data/agents';
import { categories } from '@/lib/categories';
import { getRecentAgents } from '@/lib/search';
import AgentGrid from '@/components/AgentGrid';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';
import GradientBackground from '@/components/GradientBackground';
import { Audiowide } from "next/font/google";

const audiowide = Audiowide({ subsets: ["latin"], weight: ["400"] });

export default function Home() {
  const recentAgents = getRecentAgents(6);

  return (
    <GradientBackground theme="light">
      {/* Hero Section */}
      <div className="relative z-10" style={{ isolation: 'isolate' }}>
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center flex flex-col items-center">
            <div className="inline-flex items-center justify-center group">
              <div className="relative">
                <div className="text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors duration-300">
                  <img
                    src="/images/svg/ranking.svg"
                    alt="AgentRank Logo"
                    width={48}
                    height={48}
                    className="transform group-hover:scale-110 transition-all duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-fuchsia-400/20 rounded-full blur-xl scale-0 group-hover:scale-150 transition-transform duration-300" />
              </div>
              <h1 className={`${audiowide.className} ml-4 text-4xl font-bold tracking-tight sm:text-6xl`}>
                <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">Agent</span>
                <span className="text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors duration-300">Rank</span>
              </h1>
            </div>
            <h2 className={`${audiowide.className} text-xl sm:text-1xl text-white mb-8 mt-4`}>
              Your AI Agent Directory
            </h2>
            <div className="w-full max-w-lg relative" style={{ zIndex: 9999 }}>
              <SearchBar />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-12 sm:py-20 relative" style={{ zIndex: 1 }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent sm:text-4xl">
              Browse by Category
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Explore AI agents by their primary function
            </p>
          </div>
          <div className="mt-16 flex overflow-x-auto snap-x snap-mandatory pb-4 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-8 -mx-6 px-6 sm:mx-0 pl-8 sm:pl-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="group relative rounded-2xl border border-white/10 bg-gray-800/50 backdrop-blur-xl p-4 sm:p-8 text-center transition-all duration-300 hover:bg-gray-700/50 flex-none w-[160px] sm:w-auto mr-4 sm:mr-0 snap-start flex flex-col items-center justify-center"
              >
                <div className="inline-flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors duration-300 mb-3 sm:mb-6">
                  <span className="text-2xl sm:text-3xl opacity-90 group-hover:opacity-100">{category.icon}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mb-2">
                  {category.name}
                </h3>
                <p className="hidden sm:block text-sm text-gray-400 group-hover:text-gray-300">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Agents Section */}
      <div className="py-12 sm:py-20 relative">
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
