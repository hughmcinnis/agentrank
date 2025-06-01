import Fuse from 'fuse.js';
import { Agent, agents } from '@/data/agents';

const fuseOptions = {
    keys: [
        { name: 'name', weight: 2 },
        { name: 'tagline', weight: 1.5 },
        { name: 'description', weight: 1 },
        'features',
        'useCases',
        'categories'
    ],
    threshold: 0.3,
    includeScore: true
};

const fuse = new Fuse(agents, fuseOptions);

export const searchAgents = (query: string): Agent[] => {
    if (!query.trim()) return agents;

    const results = fuse.search(query);
    return results.map(result => result.item);
};

export const filterAgentsByCategory = (category: string): Agent[] => {
    if (category === 'all') return agents;
    return agents.filter(agent => agent.categories.includes(category));
};

export const getRecentAgents = (count: number = 5): Agent[] => {
    return [...agents].sort((a, b) =>
        new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
    ).slice(0, count);
};

export const getRelatedAgents = (currentAgent: Agent, count: number = 3): Agent[] => {
    // Get all agents that share at least one category with the current agent
    const relatedAgents = agents.filter(agent =>
        agent.id !== currentAgent.id && // Exclude current agent
        agent.categories.some(category => currentAgent.categories.includes(category))
    );

    // Sort by number of matching categories (most matches first)
    return relatedAgents
        .sort((a, b) => {
            const aMatches = a.categories.filter(category => currentAgent.categories.includes(category)).length;
            const bMatches = b.categories.filter(category => currentAgent.categories.includes(category)).length;
            return bMatches - aMatches;
        })
        .slice(0, count);
}; 