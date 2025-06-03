const fs = require('fs');
const path = require('path');
const glob = require('glob');

async function getAllPages() {
    // Get all page files from the pages directory
    const pages = glob.sync('src/app/**/page.tsx', {
        ignore: ['src/app/api/**', 'src/app/**/components/**']
    });

    // Convert file paths to URLs
    return pages.map(page => {
        // Remove src/app and page.tsx
        const route = page
            .replace('src/app/', '')
            .replace('/page.tsx', '')
            // Handle dynamic routes
            .replace(/\[([^\]]+)\]/g, 'param');

        return route === '' ? '/' : `/${route}`;
    });
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
    // Use www.domain.com if that's how the site is configured
    const host = urlObj.host;
    const pages = await getAllPages();
    const urls = pages.map(page => `${baseUrl}${page}`);

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