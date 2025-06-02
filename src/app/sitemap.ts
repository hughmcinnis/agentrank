import { MetadataRoute } from 'next'
import { blogPosts } from '@/data/blog-posts' // Import blog posts
import { categories } from '@/lib/categories' // Import categories
import { agents } from '@/data/agents' // Import agents

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.agentrank.tech'; // TODO: Make sure this is the correct base URL

    // Get all blog post URLs
    const blogPostUrls = blogPosts.map(post => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.publishDate), // Or a more specific modification date if available
        changeFrequency: 'monthly' as const, // Or adjust as needed
        priority: 0.7,
    }));

    // Get all category URLs
    const categoryUrls = categories.map(category => ({
        url: `${baseUrl}/category/${category.id}`,
        lastModified: new Date(), // Assuming categories don't change often, or use a specific date
        changeFrequency: 'monthly' as const, // Or adjust as needed
        priority: 0.6,
    }));

    // Get all agent URLs
    const agentUrls = agents.map(agent => ({
        url: `${baseUrl}/agents/${agent.slug}`,
        lastModified: new Date(agent.addedDate), // Or a more specific modification date if available
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: 'yearly' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        },
        ...blogPostUrls, // Add blog post URLs
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/search`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        },
        {
            url: `${baseUrl}/category`, // Static category listing page
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        },
        ...categoryUrls, // Add dynamic category URLs
        {
            url: `${baseUrl}/agents`, // Static agents listing page
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        ...agentUrls, // Add dynamic agent URLs
    ]
} 