const fs = require('fs');
const path = require('path');
const glob = require('glob');

function extractSlugsFromTypeScript(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');

        // First try to find the array of items
        const arrayMatch = content.match(/export\s+const\s+(?:agents|blogPosts)\s*:\s*(?:Agent|BlogPost)\[\]\s*=\s*\[([\s\S]*?)\]\s*;/);
        if (!arrayMatch) {
            console.warn(`Warning: Could not find array in ${filePath}`);
            return [];
        }

        const arrayContent = arrayMatch[1];
        // Look for slug properties in each object
        const slugMatches = arrayContent.match(/slug:\s*['"]([^'"]+)['"]/g) || [];

        // Log the raw matches for debugging
        console.log(`Raw slug matches in ${path.basename(filePath)}:`, slugMatches.length);

        const slugs = slugMatches.map(match => {
            const slug = match.match(/slug:\s*['"]([^'"]+)['"]/)[1];
            return slug;
        });

        // Log the extracted slugs
        console.log(`Extracted ${slugs.length} slugs from ${path.basename(filePath)}:`, slugs);

        return slugs;
    } catch (err) {
        console.warn(`Warning: Could not read file ${filePath}:`, err.message);
        return [];
    }
}

async function getDynamicPaths() {
    const paths = {
        agents: [],
        blogs: [],
        categories: []
    };

    try {
        // Read from TypeScript data files
        const dataDir = path.join(process.cwd(), 'src', 'data');

        // Get agent slugs
        const agentsFile = path.join(dataDir, 'agents.ts');
        if (fs.existsSync(agentsFile)) {
            console.log('Found agents data file:', agentsFile);
            paths.agents = extractSlugsFromTypeScript(agentsFile);
            console.log('Total agents found:', paths.agents.length);
        }

        // Get blog post slugs
        const blogFile = path.join(dataDir, 'blog-posts.ts');
        if (fs.existsSync(blogFile)) {
            console.log('Found blog posts data file:', blogFile);
            paths.blogs = extractSlugsFromTypeScript(blogFile);
            console.log('Total blog posts found:', paths.blogs.length);
        }

        // Get categories from lib/search.ts
        const searchFile = path.join(process.cwd(), 'src', 'lib', 'search.ts');
        if (fs.existsSync(searchFile)) {
            console.log('Found search file:', searchFile);
            const content = fs.readFileSync(searchFile, 'utf8');
            const categoryMatch = content.match(/AgentCategory\s*=\s*(['"][^'"]+['"]\s*\|?\s*)+/);
            if (categoryMatch) {
                const categoryString = categoryMatch[0];
                const categories = categoryString.match(/['"]([^'"]+)['"]/g) || [];
                paths.categories = categories.map(cat => cat.replace(/['"]/g, ''));
                console.log('Total categories found:', paths.categories.length);
                console.log('Categories:', paths.categories);
            }
        }

    } catch (err) {
        console.warn('Warning: Error reading data files:', err.message);
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
        // Normalize path separators to forward slashes
        page = page.replace(/\\/g, '/');

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

        // Add normal route (removing .tsx if it's still there)
        routes.add(`/${route}`.replace('.tsx', ''));
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
    // Prefer NEXT_PUBLIC_SITE_URL over VERCEL_URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');

    if (!baseUrl) {
        console.error('No base URL found. Set NEXT_PUBLIC_SITE_URL environment variable.');
        process.exit(1);
    }

    const urlObj = new URL(baseUrl);
    const host = urlObj.host;
    const pages = await getAllPages();

    // Remove any remaining .tsx extensions and normalize paths
    const urls = pages.map(page =>
        `${baseUrl}${page}`.replace('.tsx', '').replace(/\\/g, '/')
    );

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