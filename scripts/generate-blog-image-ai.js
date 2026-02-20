#!/usr/bin/env node
/**
 * generate-blog-image-ai.js
 * Generates blog cover images using Together.ai's free FLUX.1 schnell model.
 * Falls back to SVG generator if API fails.
 *
 * Usage: node generate-blog-image-ai.js "Article Title" output-slug
 * 
 * Requires TOGETHER_API_KEY env var (get free at together.ai)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY || '';
const IMG_DIR = path.resolve(__dirname, '../public/images/blog');

function generatePrompt(title, slug) {
  // Create a visual prompt based on the article topic
  const lowerTitle = title.toLowerCase();
  const lowerSlug = slug.toLowerCase();
  
  let style = 'modern tech blog cover image, dark background, professional, clean design, no text, no words, no letters';
  let subject = '';

  if (lowerSlug.includes('vs') || lowerSlug.includes('compar')) {
    subject = 'two abstract geometric shapes facing each other, split composition, versus concept, contrasting colors cyan and magenta';
  } else if (lowerSlug.includes('email') || lowerTitle.includes('email')) {
    subject = 'floating holographic email envelope with AI circuit patterns, glowing blue and purple';
  } else if (lowerSlug.includes('code') || lowerSlug.includes('coding') || lowerSlug.includes('developer')) {
    subject = 'abstract code editor interface with glowing syntax highlighting, floating code blocks, neon blue and green';
  } else if (lowerSlug.includes('sales') || lowerSlug.includes('crm')) {
    subject = 'abstract dashboard with rising charts and connected nodes, warm gold and teal accents';
  } else if (lowerSlug.includes('writing') || lowerSlug.includes('content')) {
    subject = 'floating digital document pages with abstract AI pen, soft purple and white glow';
  } else if (lowerSlug.includes('automat') || lowerSlug.includes('workflow')) {
    subject = 'interconnected gears and lightning bolts forming a circuit, electric purple and cyan';
  } else if (lowerSlug.includes('directory') || lowerSlug.includes('list') || lowerSlug.includes('top')) {
    subject = 'grid of glowing app icons floating in space, organized rows, blue and teal palette';
  } else if (lowerSlug.includes('schedul') || lowerSlug.includes('calendar')) {
    subject = 'futuristic holographic calendar with AI assistant, soft blue glow';
  } else if (lowerSlug.includes('research') || lowerSlug.includes('scholar')) {
    subject = 'abstract brain made of connected data points and light beams, deep blue and white';
  } else {
    subject = 'abstract AI neural network visualization, glowing nodes and connections, futuristic tech aesthetic, blue and purple gradient';
  }

  return `${subject}, ${style}, 16:9 aspect ratio, high quality, photorealistic lighting`;
}

function callTogetherAPI(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'black-forest-labs/FLUX.1-schnell-Free',
      prompt: prompt,
      width: 1200,
      height: 630,
      steps: 4,
      n: 1,
      response_format: 'b64_json',
    });

    const options = {
      hostname: 'api.together.xyz',
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`API returned ${res.statusCode}: ${body.substring(0, 200)}`));
          return;
        }
        try {
          const parsed = JSON.parse(body);
          if (parsed.data && parsed.data[0] && parsed.data[0].b64_json) {
            resolve(parsed.data[0].b64_json);
          } else if (parsed.data && parsed.data[0] && parsed.data[0].url) {
            // If URL returned instead, fetch it
            resolve({ url: parsed.data[0].url });
          } else {
            reject(new Error('No image data in response'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(60000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.write(data);
    req.end();
  });
}

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : require('http');
    mod.get(url, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function generate(title, slug, outputPath) {
  if (!TOGETHER_API_KEY) {
    console.error('No TOGETHER_API_KEY set, falling back to SVG');
    const { generate: svgGen } = require('./generate-blog-image.js');
    return svgGen(title, slug, outputPath.replace(/\.(png|jpg|webp)$/, '.svg'));
  }

  const prompt = generatePrompt(title, slug);
  console.error(`Generating image for: ${title}`);
  console.error(`Prompt: ${prompt}`);

  try {
    const result = await callTogetherAPI(prompt);
    
    let buffer;
    if (typeof result === 'string') {
      buffer = Buffer.from(result, 'base64');
    } else if (result.url) {
      buffer = await downloadImage(result.url);
    }

    if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });
    
    // Save as PNG
    const pngPath = outputPath.replace(/\.[^.]+$/, '.png');
    fs.writeFileSync(pngPath, buffer);
    console.log(pngPath);
    return pngPath;
  } catch (e) {
    console.error(`AI image generation failed: ${e.message}, falling back to SVG`);
    const { generate: svgGen } = require('./generate-blog-image.js');
    return svgGen(title, slug, outputPath.replace(/\.(png|jpg|webp)$/, '.svg'));
  }
}

// CLI
if (require.main === module) {
  const [,, title, slug] = process.argv;
  if (!title || !slug) {
    console.error('Usage: node generate-blog-image-ai.js "Title" slug');
    process.exit(1);
  }
  const outputPath = path.join(IMG_DIR, `${slug}.png`);
  generate(title, slug, outputPath).catch(e => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { generate, generatePrompt };
