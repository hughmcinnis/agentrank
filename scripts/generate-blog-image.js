#!/usr/bin/env node
/**
 * generate-blog-image.js
 * Creates visually rich SVG blog cover images with:
 * - Dark tech-inspired backgrounds with gradients
 * - Network/constellation node patterns
 * - Thematic icons (circuit brain, robot, chart, etc.)
 * - Glowing accent effects
 * - Clean title text with backdrop
 *
 * Usage: node generate-blog-image.js "Title Here" output.svg [theme]
 * Themes: ai, comparison, tools, economy, directory, automation
 */

const fs = require('fs');
const path = require('path');

const themes = {
  ai: {
    bg: ['#0a0e27', '#1a1a4e'],
    accent: '#00d4ff',
    accent2: '#7c3aed',
    glow: '#00d4ff',
    icon: 'brain',
  },
  comparison: {
    bg: ['#0d1117', '#1e293b'],
    accent: '#f472b6',
    accent2: '#06b6d4',
    glow: '#f472b6',
    icon: 'versus',
  },
  tools: {
    bg: ['#0f172a', '#1e1b4b'],
    accent: '#22d3ee',
    accent2: '#a78bfa',
    glow: '#22d3ee',
    icon: 'gear',
  },
  economy: {
    bg: ['#0c1220', '#162032'],
    accent: '#fbbf24',
    accent2: '#f97316',
    glow: '#fbbf24',
    icon: 'chart',
  },
  directory: {
    bg: ['#0a0f1a', '#1a1040'],
    accent: '#34d399',
    accent2: '#06b6d4',
    glow: '#34d399',
    icon: 'grid',
  },
  automation: {
    bg: ['#0e0e1a', '#1a0e2e'],
    accent: '#c084fc',
    accent2: '#fb7185',
    glow: '#c084fc',
    icon: 'lightning',
  },
};

function pickTheme(slug) {
  if (slug.includes('vs') || slug.includes('compar')) return 'comparison';
  if (slug.includes('tool') || slug.includes('review')) return 'tools';
  if (slug.includes('econom') || slug.includes('market') || slug.includes('business')) return 'economy';
  if (slug.includes('director') || slug.includes('list') || slug.includes('top')) return 'directory';
  if (slug.includes('automat') || slug.includes('workflow') || slug.includes('pipeline')) return 'automation';
  return 'ai';
}

function generateNodes(count, seed) {
  const nodes = [];
  let s = seed;
  const rand = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  for (let i = 0; i < count; i++) {
    nodes.push({ x: rand() * 1200, y: rand() * 630, r: 1.5 + rand() * 3 });
  }
  return nodes;
}

function nodesAndLines(accent, seed) {
  const nodes = generateNodes(35, seed);
  let svg = '';
  // Draw connections between nearby nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        const opacity = (0.15 * (1 - dist / 200)).toFixed(3);
        svg += `<line x1="${nodes[i].x.toFixed(1)}" y1="${nodes[i].y.toFixed(1)}" x2="${nodes[j].x.toFixed(1)}" y2="${nodes[j].y.toFixed(1)}" stroke="${accent}" stroke-width="0.8" opacity="${opacity}"/>`;
      }
    }
  }
  // Draw nodes
  for (const n of nodes) {
    svg += `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${n.r.toFixed(1)}" fill="${accent}" opacity="0.4"/>`;
    svg += `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${(n.r * 0.5).toFixed(1)}" fill="${accent}" opacity="0.8"/>`;
  }
  return svg;
}

function iconBrain(cx, cy, accent, accent2) {
  return `
    <g transform="translate(${cx},${cy})">
      <!-- Brain outline -->
      <ellipse cx="0" cy="-10" rx="80" ry="70" fill="none" stroke="${accent}" stroke-width="2" opacity="0.6"/>
      <ellipse cx="-20" cy="-15" rx="50" ry="55" fill="none" stroke="${accent}" stroke-width="1.5" opacity="0.4"/>
      <ellipse cx="20" cy="-15" rx="50" ry="55" fill="none" stroke="${accent}" stroke-width="1.5" opacity="0.4"/>
      <!-- Circuit paths inside brain -->
      <line x1="-40" y1="-30" x2="0" y2="-50" stroke="${accent}" stroke-width="2" opacity="0.8"/>
      <line x1="0" y1="-50" x2="40" y2="-20" stroke="${accent}" stroke-width="2" opacity="0.8"/>
      <line x1="-30" y1="10" x2="10" y2="-10" stroke="${accent2}" stroke-width="2" opacity="0.7"/>
      <line x1="10" y1="-10" x2="35" y2="15" stroke="${accent2}" stroke-width="2" opacity="0.7"/>
      <line x1="-15" y1="-40" x2="-15" y2="20" stroke="${accent}" stroke-width="1.5" opacity="0.5"/>
      <line x1="15" y1="-45" x2="15" y2="25" stroke="${accent}" stroke-width="1.5" opacity="0.5"/>
      <!-- Circuit nodes -->
      <circle cx="0" cy="-50" r="5" fill="${accent}" opacity="0.9"/>
      <circle cx="-40" cy="-30" r="4" fill="${accent2}" opacity="0.8"/>
      <circle cx="40" cy="-20" r="4" fill="${accent2}" opacity="0.8"/>
      <circle cx="10" cy="-10" r="5" fill="${accent}" opacity="0.9"/>
      <circle cx="-30" cy="10" r="3" fill="${accent}" opacity="0.7"/>
      <circle cx="35" cy="15" r="3" fill="${accent}" opacity="0.7"/>
      <!-- Glow effect -->
      <circle cx="0" cy="-10" r="90" fill="${accent}" opacity="0.03"/>
      <circle cx="0" cy="-10" r="60" fill="${accent}" opacity="0.05"/>
    </g>`;
}

function iconVersus(cx, cy, accent, accent2) {
  return `
    <g transform="translate(${cx},${cy})">
      <rect x="-90" y="-50" width="75" height="100" rx="12" fill="none" stroke="${accent}" stroke-width="2.5" opacity="0.7"/>
      <rect x="15" y="-50" width="75" height="100" rx="12" fill="none" stroke="${accent2}" stroke-width="2.5" opacity="0.7"/>
      <circle cx="0" cy="0" r="22" fill="${accent}" opacity="0.15"/>
      <text x="0" y="7" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-size="20" font-weight="bold" opacity="0.9">VS</text>
      <!-- Decorative lines -->
      <line x1="-70" y1="-25" x2="-35" y2="-25" stroke="${accent}" stroke-width="2" opacity="0.5"/>
      <line x1="-70" y1="0" x2="-45" y2="0" stroke="${accent}" stroke-width="2" opacity="0.4"/>
      <line x1="-70" y1="25" x2="-40" y2="25" stroke="${accent}" stroke-width="2" opacity="0.3"/>
      <line x1="35" y1="-25" x2="70" y2="-25" stroke="${accent2}" stroke-width="2" opacity="0.5"/>
      <line x1="40" y1="0" x2="70" y2="0" stroke="${accent2}" stroke-width="2" opacity="0.4"/>
      <line x1="45" y1="25" x2="70" y2="25" stroke="${accent2}" stroke-width="2" opacity="0.3"/>
      <!-- Glow -->
      <circle cx="-52" cy="0" r="60" fill="${accent}" opacity="0.04"/>
      <circle cx="52" cy="0" r="60" fill="${accent2}" opacity="0.04"/>
    </g>`;
}

function iconGear(cx, cy, accent, accent2) {
  const teeth = 8;
  let d = '';
  for (let i = 0; i < teeth; i++) {
    const a1 = (i / teeth) * Math.PI * 2;
    const a2 = ((i + 0.3) / teeth) * Math.PI * 2;
    const a3 = ((i + 0.5) / teeth) * Math.PI * 2;
    const a4 = ((i + 0.7) / teeth) * Math.PI * 2;
    d += `${i === 0 ? 'M' : 'L'}${(Math.cos(a1) * 55).toFixed(1)},${(Math.sin(a1) * 55).toFixed(1)} `;
    d += `L${(Math.cos(a2) * 70).toFixed(1)},${(Math.sin(a2) * 70).toFixed(1)} `;
    d += `L${(Math.cos(a3) * 70).toFixed(1)},${(Math.sin(a3) * 70).toFixed(1)} `;
    d += `L${(Math.cos(a4) * 55).toFixed(1)},${(Math.sin(a4) * 55).toFixed(1)} `;
  }
  d += 'Z';
  return `
    <g transform="translate(${cx},${cy})">
      <path d="${d}" fill="none" stroke="${accent}" stroke-width="2.5" opacity="0.6"/>
      <circle cx="0" cy="0" r="25" fill="none" stroke="${accent2}" stroke-width="2" opacity="0.7"/>
      <circle cx="0" cy="0" r="8" fill="${accent}" opacity="0.5"/>
      <!-- Smaller gear offset -->
      <g transform="translate(60,-55) scale(0.5)">
        <path d="${d}" fill="none" stroke="${accent2}" stroke-width="3" opacity="0.5"/>
        <circle cx="0" cy="0" r="25" fill="none" stroke="${accent}" stroke-width="2" opacity="0.5"/>
      </g>
      <circle cx="0" cy="0" r="80" fill="${accent}" opacity="0.03"/>
    </g>`;
}

function iconChart(cx, cy, accent, accent2) {
  const bars = [45, 70, 55, 85, 65, 90, 75];
  let svg = `<g transform="translate(${cx},${cy})">`;
  // Grid lines
  for (let i = 0; i < 4; i++) {
    const y = 50 - i * 25;
    svg += `<line x1="-80" y1="${y}" x2="80" y2="${y}" stroke="white" stroke-width="0.5" opacity="0.1"/>`;
  }
  // Bars
  bars.forEach((h, i) => {
    const x = -70 + i * 23;
    const color = i % 2 === 0 ? accent : accent2;
    svg += `<rect x="${x}" y="${50 - h}" width="16" height="${h}" rx="3" fill="${color}" opacity="0.6"/>`;
    svg += `<rect x="${x}" y="${50 - h}" width="16" height="8" rx="3" fill="${color}" opacity="0.9"/>`;
  });
  // Trend line
  svg += `<polyline points="-62,20 -39,-5 -16,5 7,-25 30,-15 53,-40 76,-30" fill="none" stroke="white" stroke-width="2" opacity="0.7"/>`;
  // Arrow up
  svg += `<polygon points="76,-30 70,-22 76,-18 82,-22" fill="${accent}" opacity="0.8"/>`;
  svg += `<circle cx="0" cy="0" r="90" fill="${accent}" opacity="0.03"/>`;
  svg += `</g>`;
  return svg;
}

function iconGrid(cx, cy, accent, accent2) {
  let svg = `<g transform="translate(${cx},${cy})">`;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const x = -65 + c * 65;
      const y = -55 + r * 55;
      const color = (r + c) % 2 === 0 ? accent : accent2;
      svg += `<rect x="${x}" y="${y}" width="50" height="40" rx="8" fill="none" stroke="${color}" stroke-width="2" opacity="0.5"/>`;
      svg += `<rect x="${x + 8}" y="${y + 8}" width="34" height="6" rx="3" fill="${color}" opacity="0.3"/>`;
      svg += `<rect x="${x + 8}" y="${y + 20}" width="20" height="4" rx="2" fill="${color}" opacity="0.2"/>`;
      svg += `<circle cx="${x + 42}" cy="${y + 32}" r="4" fill="${color}" opacity="0.4"/>`;
    }
  }
  svg += `<circle cx="0" cy="0" r="100" fill="${accent}" opacity="0.03"/>`;
  svg += `</g>`;
  return svg;
}

function iconLightning(cx, cy, accent, accent2) {
  return `
    <g transform="translate(${cx},${cy})">
      <polygon points="-10,-70 -40,5 -5,5 -20,70 45,-10 5,-10 25,-70" fill="none" stroke="${accent}" stroke-width="3" opacity="0.8"/>
      <polygon points="-10,-70 -40,5 -5,5 -20,70 45,-10 5,-10 25,-70" fill="${accent}" opacity="0.1"/>
      <!-- Radiating arcs -->
      <path d="M-60,-40 A80,80 0 0,0 -60,40" fill="none" stroke="${accent2}" stroke-width="1.5" opacity="0.3"/>
      <path d="M60,-40 A80,80 0 0,1 60,40" fill="none" stroke="${accent2}" stroke-width="1.5" opacity="0.3"/>
      <path d="M-80,-30 A100,100 0 0,0 -80,30" fill="none" stroke="${accent2}" stroke-width="1" opacity="0.2"/>
      <path d="M80,-30 A100,100 0 0,1 80,30" fill="none" stroke="${accent2}" stroke-width="1" opacity="0.2"/>
      <!-- Sparks -->
      <circle cx="-35" cy="-45" r="3" fill="${accent}" opacity="0.7"/>
      <circle cx="50" cy="20" r="2.5" fill="${accent}" opacity="0.6"/>
      <circle cx="-50" cy="25" r="2" fill="${accent2}" opacity="0.5"/>
      <circle cx="0" cy="0" r="80" fill="${accent}" opacity="0.04"/>
    </g>`;
}

const iconFns = { brain: iconBrain, versus: iconVersus, gear: iconGear, chart: iconChart, grid: iconGrid, lightning: iconLightning };

function wrapTitle(title, maxChars) {
  const words = title.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).length > maxChars && line) { lines.push(line); line = w; }
    else { line = line ? line + ' ' + w : w; }
  }
  if (line) lines.push(line);
  return lines;
}

function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function generate(title, slug, outputPath, themeName) {
  const t = themes[themeName || pickTheme(slug)] || themes.ai;
  let hash = 0;
  for (const c of slug) hash = ((hash << 5) - hash + c.charCodeAt(0)) | 0;
  const seed = Math.abs(hash);

  const lines = wrapTitle(title, 32);
  const lineHeight = 48;
  const textBlockHeight = lines.length * lineHeight;
  const textY = 500 - textBlockHeight;

  const iconFn = iconFns[t.icon] || iconBrain;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${t.bg[0]}"/>
      <stop offset="100%" style="stop-color:${t.bg[1]}"/>
    </linearGradient>
    <linearGradient id="textBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${t.bg[1]};stop-opacity:0"/>
      <stop offset="40%" style="stop-color:${t.bg[1]};stop-opacity:0.85"/>
      <stop offset="100%" style="stop-color:${t.bg[0]};stop-opacity:0.95"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Network pattern -->
  ${nodesAndLines(t.accent, seed)}

  <!-- Central icon -->
  ${iconFn(600, 220, t.accent, t.accent2)}

  <!-- Accent line -->
  <line x1="200" y1="${textY - 20}" x2="1000" y2="${textY - 20}" stroke="${t.accent}" stroke-width="1" opacity="0.3"/>

  <!-- Text backdrop gradient -->
  <rect x="0" y="${textY - 60}" width="1200" height="${630 - textY + 60}" fill="url(#textBg)"/>

  <!-- Title -->
  <text x="600" y="${textY + 10}" text-anchor="middle" fill="white" font-family="'Segoe UI',Arial,Helvetica,sans-serif" font-size="40" font-weight="bold" filter="url(#glow)">
    ${lines.map((l, i) => `<tspan x="600" dy="${i === 0 ? 0 : lineHeight}">${esc(l)}</tspan>`).join('\n    ')}
  </text>

  <!-- Brand -->
  <text x="600" y="605" text-anchor="middle" fill="${t.accent}" font-family="'Segoe UI',Arial,sans-serif" font-size="18" opacity="0.6" letter-spacing="3">AGENTRANK.TECH</text>
</svg>`;

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outputPath, svg);
  return outputPath;
}

// CLI mode
if (require.main === module) {
  const [,, title, output, theme] = process.argv;
  if (!title || !output) {
    console.error('Usage: node generate-blog-image.js "Title" output.svg [theme]');
    process.exit(1);
  }
  const slug = path.basename(output, '.svg');
  generate(title, slug, output, theme);
  console.log(`Generated: ${output}`);
}

module.exports = { generate, pickTheme };
