const fs = require('fs');
const path = require('path');
const https = require('https');

const agents = require('../src/data/agents').agents;
const logoDir = path.join(__dirname, '../public/images/logos');

// Create logos directory if it doesn't exist
if (!fs.existsSync(logoDir)) {
    fs.mkdirSync(logoDir, { recursive: true });
}

// Function to download a file
function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, response => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', err => {
            fs.unlink(dest);
            reject(err);
        });
    });
}

// Process each agent
async function downloadLogos() {
    for (const agent of agents) {
        const logoPath = path.join(logoDir, `${agent.slug}-logo.svg`);

        // Skip if logo already exists
        if (fs.existsSync(logoPath)) {
            console.log(`Logo for ${agent.name} already exists`);
            continue;
        }

        try {
            // Here you would normally download from the agent's website
            // For now, we'll create a placeholder SVG
            const placeholderSvg = `<svg width="200" height="50" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16">${agent.name}</text>
      </svg>`;

            fs.writeFileSync(logoPath, placeholderSvg);
            console.log(`Created placeholder logo for ${agent.name}`);
        } catch (error) {
            console.error(`Error creating logo for ${agent.name}:`, error);
        }
    }
}

downloadLogos().catch(console.error); 