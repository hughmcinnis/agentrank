const fs = require('fs');
const path = require('path');
const glob = require('glob');

async function getDynamicPaths() {
    const paths = {
        agents: [],
        blogs: [],
        categories: []
    };

    try {
        // Get agent slugs
        const agentsDir = path.join(process.cwd(), 'public', 'agents');
        if (fs.existsSync(agentsDir)) {
            const files = fs.readdirSync(agentsDir);
            paths.agents = files
                .filter(file => file.endsWith('.json'))
                .map(file => file.replace('.json', ''));
        }

        // Get blog slugs
        const blogsDir = path.join(process.cwd(), 'public', 'blog');
        if (fs.existsSync(blogsDir)) {
            const files = fs.readdirSync(blogsDir);
            paths.blogs = files
                .filter(file => file.endsWith('.json'))
                .map(file => file.replace('.json', ''));
        }

        // Get category slugs
        const categoriesDir = path.join(process.cwd(), 'public', 'categories');
        if (fs.existsSync(categoriesDir)) {
            const files = fs.readdirSync(categoriesDir);
            paths.categories = files
                .filter(file => file.endsWith('.json'))
                .map(file => file.replace('.json', ''));
        }
    } catch (err) {
        console.warn('Warning: Error reading dynamic content directories:', err.message);
    }

    return paths;
}

async function getAllPages() {
    // Get all page files from the pages directory
    const pages = glob.sync('src/app/**/page.tsx', {
        ignore: ['src/app/api/**', 'src/app/**/components/**']
    });

    // Get all dynamic content paths
    const dynamicPaths = await getDynamicPaths();

    // Convert file paths to URLs and handle dynamic routes
    const routes = new Set();

    pages.forEach(page => {
        // Remove src/app and page.tsx
        let route = page
            .replace('src/app/', '')
            .replace('/page.tsx', '');

        // Handle root route
        if (route === '') {
            routes.add('/');
            return;
        }

        // Handle dynamic agent routes
        if (route.includes('agents/[slug]')) {
            dynamicPaths.agents.forEach(slug => {
                routes.add(`/agents/${slug}`);
            });
            return;
        }

        // Handle dynamic blog routes
        if (route.includes('blog/[slug]')) {
            dynamicPaths.blogs.forEach(slug => {
                routes.add(`/blog/${slug}`);
            });
            return;
        }

        // Handle dynamic category routes
        if (route.includes('category/[category]')) {
            dynamicPaths.categories.forEach(category => {
                routes.add(`/category/${category}`);
            });
            return;
        }

        // Add normal route
        routes.add(`/${route}`);
    });

    // Add additional known routes
    const additionalRoutes = [
        '/about',
        '/terms',
        '/privacy',
        '/search',
        '/blog',
        // Add any other static routes that might not be detected
    ];

    additionalRoutes.forEach(route => routes.add(route));

    // Log the dynamic content counts
    console.log('Dynamic content found:', {
        agents: dynamicPaths.agents.length,
        blogs: dynamicPaths.blogs.length,
        categories: dynamicPaths.categories.length
    });

    return Array.from(routes);
}

async function submitUrls() {
    const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_SITE_URL;

    if (!baseUrl) {
        console.error('No base URL found. Set NEXT_PUBLIC_SITE_URL environment variable.');
        process.exit(1);
    }

    const urlObj = new URL(baseUrl);
    const host = urlObj.host;
    const pages = await getAllPages();
    const urls = pages.map(page => `${baseUrl}${page}`);

    console.log(`Found ${urls.length} total URLs to submit`);
    console.log('Routes found:', pages);

    // Batch URLs into groups of 10,000 (IndexNow limit)
    const batchSize = 10000;
    const batches = [];
    for (let i = 0; i < urls.length; i += batchSize) {
        batches.push(urls.slice(i, i + batchSize));
    }

    console.log(`Submitting URLs for host: ${host}`);
    console.log(`Key location: ${baseUrl}/80cd11cf3a544e6593c65a4c3e9c4a68.txt`);

    // Submit each batch
    for (const batch of batches) {
        try {
            const response = await fetch('https://api.indexnow.org/indexnow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    host: host,
                    key: '80cd11cf3a544e6593c65a4c3e9c4a68',
                    urlList: batch,
                    keyLocation: `${baseUrl}/80cd11cf3a544e6593c65a4c3e9c4a68.txt`
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
            }

            console.log(`Successfully submitted ${batch.length} URLs to IndexNow`);
            console.log('Sample URLs:', batch.slice(0, 3));
        } catch (error) {
            console.error('Failed to submit URLs:', error);
        }
    }
}

submitUrls().catch(console.error); 