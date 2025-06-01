import { BlogPost } from '@/data/blog-posts';

export function searchBlogPosts(posts: BlogPost[], query: string): BlogPost[] {
    const searchTerm = query.toLowerCase();
    return posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        post.categories.some(category => category.toLowerCase().includes(searchTerm))
    );
}

export function filterPostsByCategory(posts: BlogPost[], category: string): BlogPost[] {
    return posts.filter(post =>
        post.categories.some(cat => cat.toLowerCase() === category.toLowerCase())
    );
}

export function filterPostsByTag(posts: BlogPost[], tag: string): BlogPost[] {
    return posts.filter(post =>
        post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
}

export function getRelatedPosts(currentPost: BlogPost, allPosts: BlogPost[], limit: number = 3): BlogPost[] {
    // Exclude the current post
    const otherPosts = allPosts.filter(post => post.id !== currentPost.id);

    // Score each post based on matching categories and tags
    const scoredPosts = otherPosts.map(post => {
        let score = 0;

        // Score matching categories
        currentPost.categories.forEach(category => {
            if (post.categories.includes(category)) {
                score += 2; // Categories are weighted more heavily
            }
        });

        // Score matching tags
        currentPost.tags.forEach(tag => {
            if (post.tags.includes(tag)) {
                score += 1;
            }
        });

        return { post, score };
    });

    // Sort by score and return top matches
    return scoredPosts
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.post);
}

export function getAllCategories(posts: BlogPost[]): string[] {
    const categoriesSet = new Set<string>();
    posts.forEach(post => {
        post.categories.forEach(category => {
            categoriesSet.add(category);
        });
    });
    return Array.from(categoriesSet).sort();
}

export function getAllTags(posts: BlogPost[]): string[] {
    const tagsSet = new Set<string>();
    posts.forEach(post => {
        post.tags.forEach(tag => {
            tagsSet.add(tag);
        });
    });
    return Array.from(tagsSet).sort();
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();

    const suffix = ['th', 'st', 'nd', 'rd'];
    const lastDigit = day % 10;
    const suffixIndex = lastDigit <= 3 && Math.floor(day / 10) !== 1 ? lastDigit : 0;

    return `${month} ${day}${suffix[suffixIndex] || 'th'}, ${year}`;
}

export function processMarkdownContent(content: string): string {
    return content
        // Remove extra spaces at the start of lines
        .replace(/^[ \t]+/gm, '')
        // Ensure proper spacing after headers
        .replace(/^(#{1,6}.*)\n/gm, '$1\n\n')
        // Ensure proper spacing around lists
        .replace(/^(-|\d+\.) /gm, '\n$&')
        // Remove multiple blank lines
        .replace(/\n{3,}/g, '\n\n')
        // Trim whitespace
        .trim();
} 