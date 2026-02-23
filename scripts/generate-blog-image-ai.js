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

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePrompt(title, slug) {
  const lower = (title + ' ' + slug).toLowerCase();
  
  // Randomly select a visual style for variety across posts
  const styles = [
    'Photorealistic, cinematic composition, shallow depth of field, dramatic lighting.',
    'Stylized 3D render, clean geometric shapes, vibrant gradients, modern design aesthetic.',
    'Editorial illustration style, bold flat colors with subtle texture, magazine cover quality.',
    'Atmospheric digital painting, painterly brushstrokes visible, rich color palette.',
    'Minimalist photography, strong use of negative space, single bold accent color.',
    'Retro-futuristic aesthetic, chrome and neon, 80s sci-fi meets modern tech.',
    'Isometric 3D illustration, soft shadows, pastel and neon color mix, clean lines.',
    'High contrast black and white with a single vivid color accent, dramatic shadows.',
  ];

  // Randomly select a color palette
  const palettes = [
    'Color palette: deep navy, electric cyan, warm amber.',
    'Color palette: charcoal, coral pink, mint green.',
    'Color palette: midnight purple, golden yellow, soft white.',
    'Color palette: forest green, burnt orange, cream.',
    'Color palette: slate blue, magenta, silver.',
    'Color palette: dark teal, sunset orange, pale lavender.',
    'Color palette: indigo, lime green, warm gray.',
    'Color palette: burgundy, copper, off-white.',
  ];

  const style = pick(styles);
  const palette = pick(palettes);
  const noText = 'No text, no words, no letters, no watermarks, no logos.';
  
  // Category-specific scene pools (multiple options each)
  let scenes;
  
  if (lower.includes('vs') || lower.includes('compar') || lower.includes('versus')) {
    scenes = [
      'Two contrasting objects on a balance scale — one organic and one geometric — in a dramatic studio setting.',
      'A split-screen composition: two distinct environments divided by a sharp diagonal line, each with different mood and color.',
      'Two chess pieces facing each other on a reflective surface, dramatic spotlight from above.',
      'A fork in a road seen from above, each path leading to a different glowing horizon.',
      'Two different shaped keys hovering above a single keyhole, dramatic perspective.',
    ];
  } else if (lower.includes('voice') || lower.includes('tts') || lower.includes('speech') || lower.includes('elevenlabs') || lower.includes('audio')) {
    scenes = [
      'Sound waves rippling through a dark space, transforming from digital waveform into colorful organic shapes.',
      'A vintage microphone surrounded by floating holographic sound visualization rings.',
      'Close-up of a speaker cone with visible sound waves emanating outward, abstract and artistic.',
      'A human silhouette made entirely of flowing audio waveforms and frequency patterns.',
    ];
  } else if (lower.includes('terminal') || lower.includes('warp') || lower.includes('command line') || lower.includes('cli')) {
    scenes = [
      'Close-up of a curved ultrawide monitor displaying terminal text, mechanical keyboard in foreground with dramatic underglow.',
      'A dark room illuminated only by green terminal text reflected on a developer\'s glasses.',
      'Abstract representation of command-line output flowing like a waterfall of glowing characters.',
      'A retro CRT monitor displaying a modern terminal, mixing old and new aesthetics.',
    ];
  } else if (lower.includes('code') || lower.includes('coding') || lower.includes('cursor') || lower.includes('editor') || lower.includes('copilot') || lower.includes('developer')) {
    scenes = [
      'Over-the-shoulder view of a developer at a dual-monitor setup with colorful syntax highlighting, warm ambient room.',
      'Abstract code flowing like a river of light through a dark cityscape.',
      'A pair of hands hovering over a holographic keyboard, code materializing in the air above.',
      'Bird\'s eye view of a developer workspace — monitors, coffee, notebooks — with code reflected on every surface.',
      'A single monitor in a dark room showing an elegant code editor, with the code casting colorful light on the wall behind.',
    ];
  } else if (lower.includes('replit') || lower.includes('bolt') || lower.includes('v0') || lower.includes('app builder') || lower.includes('no-code') || lower.includes('build')) {
    scenes = [
      'Overhead shot of a tablet showing an app being assembled from colorful building blocks, scattered design tools around it.',
      'A 3D printer-like device extruding a glowing app interface, layer by layer.',
      'Hands arranging glowing UI components like puzzle pieces on a glass table.',
      'A blueprint unrolling to reveal a finished, glowing mobile app interface emerging from the paper.',
    ];
  } else if (lower.includes('search') || lower.includes('brave') || lower.includes('perplexity') || lower.includes('browser')) {
    scenes = [
      'A magnifying glass hovering over a sea of glowing data points, focusing one cluster into clarity.',
      'An explorer standing at the edge of a vast digital landscape, pathways of light leading in different directions.',
      'Abstract visualization of search: light beams converging through a prism into a single focused point.',
      'A compass made of light floating above an infinite library of glowing book spines.',
    ];
  } else if (lower.includes('notion') || lower.includes('workspace') || lower.includes('productivity') || lower.includes('organiz')) {
    scenes = [
      'A beautifully organized desk from above: color-coded notebooks, a clean screen showing a structured layout, plants and stationery.',
      'Abstract interconnected rooms seen in cross-section, each containing different types of work — documents, databases, calendars.',
      'A single notebook transforming into a digital interface, pages becoming interactive holographic panels.',
      'A zen garden with raked sand patterns that form the structure of an organizational chart.',
    ];
  } else if (lower.includes('email') || lower.includes('superhuman') || lower.includes('lavender')) {
    scenes = [
      'Paper airplanes made of light soaring through a dark space, leaving glowing trails.',
      'A sleek laptop in a sunlit minimalist office, envelope icons floating gently upward from the screen.',
      'An abstract inbox visualization: messages as glowing orbs being sorted by invisible hands.',
    ];
  } else if (lower.includes('sales') || lower.includes('crm') || lower.includes('clay') || lower.includes('revenue')) {
    scenes = [
      'A rising bar chart made of illuminated glass columns in a dark executive environment.',
      'A handshake between a human hand and a translucent digital hand, deal energy radiating from the point of contact.',
      'A radar screen showing glowing pings representing leads and opportunities, dark command-center aesthetic.',
    ];
  } else if (lower.includes('schedul') || lower.includes('calendar') || lower.includes('meeting')) {
    scenes = [
      'A holographic calendar floating in a modern office, time blocks glowing in different colors.',
      'An hourglass with digital particles flowing instead of sand, surrounded by clock faces.',
      'A sundial casting digital shadows that form a schedule grid on the ground below.',
    ];
  } else if (lower.includes('research') || lower.includes('scholar') || lower.includes('academ')) {
    scenes = [
      'An ancient library with books flying open, pages releasing glowing data streams into the air.',
      'A microscope with a holographic display showing interconnected research papers as a knowledge graph.',
      'Stacked books dissolving into particles that reform as a sleek digital interface.',
    ];
  } else if (lower.includes('writing') || lower.includes('content') || lower.includes('copy') || lower.includes('jasper')) {
    scenes = [
      'A vintage typewriter with each keystroke releasing butterflies made of light.',
      'A pen hovering over paper, its ink flowing upward and forming a constellation of ideas.',
      'An open book with words lifting off the page and swirling into a creative vortex above.',
    ];
  } else if (lower.includes('automat') || lower.includes('workflow') || lower.includes('zapier') || lower.includes('multi-agent') || lower.includes('agent')) {
    scenes = [
      'A series of interlocking gears made of light, each one a different color, working in harmony inside a transparent machine.',
      'Dominoes made of glowing circuit boards falling in a perfect chain reaction.',
      'A conductor\'s baton directing an orchestra of floating robotic instruments, each performing a different task.',
      'A conveyor belt of light carrying abstract tasks through transformation stations, each changing the objects\' form.',
      'A network of glowing spheres connected by light bridges, pulsing with data flowing between them.',
    ];
  } else if (lower.includes('devin') || lower.includes('software engineer') || lower.includes('ai engineer')) {
    scenes = [
      'A futuristic workstation with holographic screens showing architecture diagrams, code, and tests simultaneously.',
      'A robot seated at a developer desk, multiple mechanical arms each typing on a different keyboard.',
      'An AI brain made of circuit patterns, with code streaming out of it like thoughts becoming reality.',
    ];
  } else if (lower.includes('crypto') || lower.includes('blockchain') || lower.includes('web3')) {
    scenes = [
      'Glowing hexagonal nodes linked in a 3D network, floating in dark space with golden accents.',
      'A digital vault door opening to reveal a network of shimmering blockchain connections.',
      'Abstract crystalline structures growing and connecting, representing distributed ledger architecture.',
    ];
  } else if (lower.includes('economy') || lower.includes('market') || lower.includes('business') || lower.includes('startup')) {
    scenes = [
      'A cityscape at night with holographic data charts reflected in floor-to-ceiling windows.',
      'Seeds sprouting into glowing tech trees in a futuristic greenhouse, growth metaphor.',
      'A rocket made of abstract geometric shapes launching from a laptop screen into a starfield.',
    ];
  } else if (lower.includes('directory') || lower.includes('list') || lower.includes('top') || lower.includes('best')) {
    scenes = [
      'A curated gallery wall with glowing frames, each containing a different abstract app icon.',
      'A night market of technology — stalls of light each showcasing different glowing tools.',
      'A collector\'s display case with holographic tools arranged like precious artifacts.',
    ];
  } else {
    scenes = [
      'A sleek robotic hand reaching toward a floating holographic brain made of light particles and neural connections.',
      'An abstract neural network visualization: nodes of light pulsing and connecting across a vast dark space.',
      'A human eye reflecting a complex AI interface, macro photography style.',
      'A door opening from a dark room into a bright digital landscape full of possibility.',
      'A crystal ball sitting on a modern desk, showing swirling AI visualizations inside.',
    ];
  }
  
  const scene = pick(scenes);
  return `${scene} ${style} ${palette} ${noText}`;
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
