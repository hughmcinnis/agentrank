#!/usr/bin/env node
/**
 * generate-blog-image-ai.js
 * Generates blog cover images using OpenAI's GPT Image 1 model.
 * Falls back to SVG generator if API fails.
 *
 * Usage: 
 *   node generate-blog-image-ai.js "Article Title" output-slug
 *   Called automatically by publish-blog-post.js
 * 
 * Requires OPENAI_API_KEY env var or key file at ~/.credentials/openai-api-key.txt
 */

const fs = require('fs');
const path = require('path');

const IMG_DIR = path.resolve(__dirname, '../public/images/blog');
const KEY_FILE = path.resolve(process.env.HOME || '/home/user', '.credentials/openai-api-key.txt');

function getApiKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY.trim();
  try { return fs.readFileSync(KEY_FILE, 'utf-8').trim(); } catch { return ''; }
}

function generatePrompt(title, slug) {
  const lower = (title + ' ' + slug).toLowerCase();
  
  // Base style that all images share for brand consistency
  const baseStyle = 'Photorealistic, cinematic composition, shallow depth of field, dark moody lighting. No text, no words, no letters, no watermarks, no logos.';
  
  // Determine the visual scene based on article content
  let scene;
  
  if (lower.includes('vs') || lower.includes('compar') || lower.includes('versus')) {
    scene = 'Two contrasting holographic interfaces floating side by side in a dark room, one glowing cyan and the other glowing magenta. Split composition suggesting comparison. Dramatic rim lighting.';
  } else if (lower.includes('terminal') || lower.includes('warp') || lower.includes('command line') || lower.includes('cli')) {
    scene = 'Close-up of a sleek curved monitor displaying a dark terminal with green and cyan command-line text. Mechanical keyboard in foreground, moody purple ambient LED lighting. Developer workspace aesthetic.';
  } else if (lower.includes('code') || lower.includes('coding') || lower.includes('cursor') || lower.includes('editor') || lower.includes('copilot') || lower.includes('developer')) {
    scene = 'A person sitting at a modern desk using a large monitor showing a code editor with colorful syntax highlighting. Dimly lit room with warm ambient lighting. Over-the-shoulder perspective.';
  } else if (lower.includes('replit') || lower.includes('bolt') || lower.includes('v0') || lower.includes('app builder') || lower.includes('no-code') || lower.includes('build')) {
    scene = 'Overhead shot of a creative workspace with a tablet showing a colorful app interface being designed. Scattered design elements, stylus pen, coffee mug. Clean modern desk with soft warm lighting.';
  } else if (lower.includes('search') || lower.includes('brave') || lower.includes('perplexity') || lower.includes('browser')) {
    scene = 'A glowing transparent holographic search interface floating in a dark space, showing abstract search results as flowing light streams. Blue and orange accent lighting, futuristic but grounded.';
  } else if (lower.includes('email') || lower.includes('superhuman') || lower.includes('lavender')) {
    scene = 'A sleek laptop on a minimalist desk showing an elegant email interface. Soft natural light from a window, clean modern office aesthetic. Coffee cup and small plant nearby.';
  } else if (lower.includes('sales') || lower.includes('crm') || lower.includes('clay') || lower.includes('revenue')) {
    scene = 'A modern dashboard on an ultrawide monitor showing sales analytics with glowing charts and graphs. Dark office environment, teal and gold accent lighting reflecting off the desk surface.';
  } else if (lower.includes('schedul') || lower.includes('calendar') || lower.includes('meeting')) {
    scene = 'A floating holographic calendar interface showing color-coded time blocks, hovering above a clean white desk. Soft blue ambient glow, minimalist futuristic aesthetic.';
  } else if (lower.includes('research') || lower.includes('scholar') || lower.includes('academ')) {
    scene = 'An open laptop surrounded by floating holographic document pages and citation links in a dark study. Warm desk lamp light mixing with cool blue screen glow. Academic but futuristic.';
  } else if (lower.includes('writing') || lower.includes('content') || lower.includes('copy') || lower.includes('jasper')) {
    scene = 'A writer\'s desk with a glowing screen showing a clean document editor. Warm ambient lighting, vintage typewriter nearby for contrast. Cozy creative workspace with bokeh background lights.';
  } else if (lower.includes('automat') || lower.includes('workflow') || lower.includes('zapier') || lower.includes('agent')) {
    scene = 'A sleek robotic hand interacting with a holographic flowchart of connected glowing nodes. Dark studio background, dramatic cyan and purple rim lighting. Hyper-detailed 3D render quality.';
  } else if (lower.includes('devin') || lower.includes('software engineer') || lower.includes('ai engineer')) {
    scene = 'A futuristic AI workstation with multiple floating holographic screens showing code, architecture diagrams, and terminal output simultaneously. Dark room, blue and green accent lighting.';
  } else if (lower.includes('crypto') || lower.includes('blockchain') || lower.includes('web3')) {
    scene = 'Abstract visualization of a blockchain network — glowing interconnected hexagonal nodes floating in dark space. Gold and cyan color accents, cinematic depth of field.';
  } else if (lower.includes('economy') || lower.includes('market') || lower.includes('business') || lower.includes('startup')) {
    scene = 'A cityscape at night seen through a floor-to-ceiling office window, with holographic data charts reflected in the glass. Moody blue and gold tones, executive aesthetic.';
  } else if (lower.includes('directory') || lower.includes('list') || lower.includes('top') || lower.includes('best')) {
    scene = 'A grid of glowing app icons floating in organized rows in dark space, like a futuristic app store. Each icon subtly different colors — cyan, purple, green, orange. Clean isometric perspective.';
  } else {
    // Default: generic AI/tech cover
    scene = 'A sleek robotic hand reaching toward a floating holographic brain made of light particles and neural connections. Dark studio background, dramatic rim lighting in cyan and purple. Hyper-detailed.';
  }
  
  return `${scene} ${baseStyle}`;
}

async function callOpenAI(prompt, apiKey) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      size: '1536x1024',
      quality: 'medium',
      n: 1,
    }),
  });

  const json = await res.json();
  
  if (json.error) {
    throw new Error(`OpenAI API error: ${json.error.message}`);
  }
  
  if (json.data?.[0]?.b64_json) {
    return Buffer.from(json.data[0].b64_json, 'base64');
  }
  
  throw new Error('No image data in response');
}

async function generate(title, slug, outputPath) {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.error('No OpenAI API key found, falling back to SVG');
    const { generate: svgGen } = require('./generate-blog-image.js');
    return svgGen(title, slug, outputPath.replace(/\.(png|jpg|webp)$/, '.svg'));
  }

  const prompt = generatePrompt(title, slug);
  console.error(`Generating image for: ${title}`);
  console.error(`Prompt: ${prompt.substring(0, 100)}...`);

  try {
    const buffer = await callOpenAI(prompt, apiKey);

    if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true });
    
    const pngPath = outputPath.replace(/\.[^.]+$/, '.png');
    fs.writeFileSync(pngPath, buffer);
    console.error(`Generated: ${pngPath} (${(buffer.length / 1024).toFixed(0)}KB)`);
    return pngPath;
  } catch (e) {
    console.error(`AI image generation failed: ${e.message}, falling back to SVG`);
    const { generate: svgGen } = require('./generate-blog-image.js');
    return svgGen(title, slug, outputPath.replace(/\.(png|jpg|webp)$/, '.svg'));
  }
}

// CLI mode
if (require.main === module) {
  const [,, title, slug] = process.argv;
  if (!title || !slug) {
    console.error('Usage: node generate-blog-image-ai.js "Title" slug');
    process.exit(1);
  }
  const outputPath = path.join(IMG_DIR, `${slug}.png`);
  generate(title, slug, outputPath).then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { generate, generatePrompt };
