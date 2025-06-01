import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: 'none',
                        h1: {
                            fontWeight: '800',
                            marginBottom: '2rem',
                        },
                        h2: {
                            fontWeight: '700',
                            marginTop: '2.5rem',
                            marginBottom: '1.5rem',
                        },
                        h3: {
                            fontWeight: '600',
                            marginTop: '2rem',
                            marginBottom: '1rem',
                        },
                        'ul > li': {
                            paddingLeft: '1.5em',
                        },
                        'ol > li': {
                            paddingLeft: '1.5em',
                        },
                        code: {
                            color: '#ef4444',
                            '&::before': {
                                content: '""',
                            },
                            '&::after': {
                                content: '""',
                            },
                        },
                        'code::before': {
                            content: '""',
                        },
                        'code::after': {
                            content: '""',
                        },
                    },
                },
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
}

export default config 