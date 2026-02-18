import { AgentCategory } from './search';

export interface Category {
    id: AgentCategory;
    name: string;
    description: string;
    icon: string;
}

export const categories: Category[] = [
    {
        id: 'writing',
        name: 'Writing',
        description: 'AI agents that help with content creation and writing tasks',
        icon: '✍️'
    },
    {
        id: 'coding',
        name: 'Coding',
        description: 'AI-powered development and programming assistants',
        icon: '💻'
    },
    {
        id: 'sales',
        name: 'Sales',
        description: 'AI tools for sales automation and customer acquisition',
        icon: '💰'
    },
    {
        id: 'customer-support',
        name: 'Customer Support',
        description: 'AI agents for customer service and support automation',
        icon: '🎯'
    },
    {
        id: 'data-analysis',
        name: 'Data Analysis',
        description: 'AI tools for data processing and analytics',
        icon: '📊'
    },
    {
        id: 'research',
        name: 'Research',
        description: 'AI assistants for research and information gathering',
        icon: '🔍'
    },
    {
        id: 'marketing',
        name: 'Marketing',
        description: 'AI tools for marketing and promotion',
        icon: '📢'
    },
    {
        id: 'productivity',
        name: 'Productivity',
        description: 'General purpose AI assistants for various tasks',
        icon: '⚡'
    },
    {
        id: 'email',
        name: 'Email',
        description: 'AI tools for email management and communication',
        icon: '📧'
    },
    {
        id: 'transcription',
        name: 'Transcription',
        description: 'AI-powered audio and video transcription tools',
        icon: '🎙️'
    },
    {
        id: 'document-analysis',
        name: 'Document Analysis',
        description: 'AI tools for analyzing and processing documents',
        icon: '📄'
    },
    {
        id: 'scheduling',
        name: 'Scheduling',
        description: 'AI assistants for calendar and meeting management',
        icon: '📅'
    },
    {
        id: 'seo',
        name: 'SEO',
        description: 'AI tools for search engine optimization',
        icon: '🔎'
    },
    {
        id: 'social-media',
        name: 'Social Media',
        description: 'AI tools for social media management and content',
        icon: '📱'
    },
    {
        id: 'accounting',
        name: 'Accounting',
        description: 'AI tools for financial management and bookkeeping',
        icon: '💵'
    },
    {
        id: 'home-improvement',
        name: 'Home Improvement',
        description: 'AI assistants for home repair, maintenance, and DIY projects',
        icon: '🔨'
    }
];

export const getCategoryById = (id: AgentCategory): Category | undefined => {
    return categories.find(category => category.id === id);
};

export const getCategoryName = (id: AgentCategory): string => {
    return getCategoryById(id)?.name || id;
}; 