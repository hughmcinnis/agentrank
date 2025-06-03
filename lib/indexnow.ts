// Example function to submit a single URL to IndexNow
// You'll need to replace 'YOUR_API_KEY' with your actual IndexNow API key.

async function submitUrlToIndexNow(urlToSubmit: string) {
    const apiKey = 'YOUR_API_KEY'; // Replace with your key
    const searchEngineEndpoint = 'https://api.indexnow.org/indexnow'; // General endpoint

    // Construct the IndexNow API URL
    // The keyLocation is your key file at the root
    const submissionUrl = `${searchEngineEndpoint}?url=${encodeURIComponent(urlToSubmit)}&key=${apiKey}&keyLocation=${encodeURIComponent(`https://www.agentrank.tech/${apiKey}.txt`)}`;

    try {
        const response = await fetch(submissionUrl, { method: 'GET' });

        if (response.ok) {
            console.log(`Successfully submitted ${urlToSubmit} to IndexNow. Status: ${response.status}`);
            // Potentially, you could check response.status for 200 (OK) or 202 (Accepted)
        } else {
            console.error(`Error submitting ${urlToSubmit} to IndexNow. Status: ${response.status}`);
            const errorBody = await response.text();
            console.error('Error details:', errorBody);
        }
    } catch (error) {
        console.error(`Network or other error submitting ${urlToSubmit} to IndexNow:`, error);
    }
}

// Example function to submit multiple URLs
async function submitUrlsToIndexNow(urls: string[]) {
    const apiKey = 'YOUR_API_KEY'; // Replace with your key
    const host = 'www.agentrank.tech';
    const searchEngineEndpoint = 'https://api.indexnow.org/indexnow'; // General endpoint

    const payload = {
        host: host,
        key: apiKey,
        keyLocation: `https://www.agentrank.tech/${apiKey}.txt`,
        urlList: urls,
    };

    try {
        const response = await fetch(searchEngineEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            console.log(`Successfully submitted ${urls.length} URLs to IndexNow. Status: ${response.status}`);
        } else {
            console.error(`Error submitting URLs to IndexNow. Status: ${response.status}`);
            const errorBody = await response.text();
            console.error('Error details:', errorBody);
        }
    } catch (error) {
        console.error(`Network or other error submitting URLs to IndexNow:`, error);
    }
}

// --- How to use them ---
// To submit a single URL:
// submitUrlToIndexNow("https://www.agentrank.tech/your-new-page");

// To submit multiple URLs:
// submitUrlsToIndexNow([
//   "https://www.agentrank.tech/updated-page-1",
//   "https://www.agentrank.tech/new-article-2",
//   "https://www.agentrank.tech/deleted-page-3" // For deleted pages too
// ]);

// Export the functions if you want to use them in other files
export { submitUrlToIndexNow, submitUrlsToIndexNow }; 