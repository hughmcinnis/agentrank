'use client';

interface Props {
    children: React.ReactNode;
    theme?: 'dark' | 'light';
}

export default function GradientBackground({ children, theme = 'dark' }: Props) {
    const isDark = theme === 'dark';

    return (
        <div className={`relative min-h-screen ${isDark
            ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900'
            : 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800'
            }`}>
            {/* Animated gradient orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse ${isDark ? 'bg-blue-500/30' : 'bg-blue-400/40'
                    }`} />
                <div className={`absolute top-20 -left-40 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 ${isDark ? 'bg-purple-500/20' : 'bg-purple-400/30'
                    }`} />
                <div className={`absolute bottom-0 right-20 w-72 h-72 rounded-full blur-3xl animate-pulse delay-2000 ${isDark ? 'bg-cyan-500/20' : 'bg-cyan-400/30'
                    }`} />
            </div>

            {/* Grid pattern overlay */}
            <div
                className={`absolute inset-0 ${isDark ? 'opacity-20' : 'opacity-10'}`}
                style={{
                    backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                                    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}
            />

            {/* Content */}
            <div className="relative" style={{ isolation: 'isolate' }}>
                {children}
            </div>
        </div>
    );
} 