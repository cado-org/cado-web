const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'public', 'images');

const dirs = [
  baseDir,
  path.join(baseDir, 'brands'),
  path.join(baseDir, 'categories'),
  path.join(baseDir, 'products'),
  path.join(baseDir, 'projects'),
  path.join(baseDir, 'hero'),
];

dirs.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// 1. BRAND LOGOS
const brands = [
  {
    name: 'cado.svg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50">
      <rect width="160" height="50" fill="#ffffff"/>
      <g transform="translate(10, 8)">
        <path d="M10 28 L4 20 L6 12 L12 6 L18 4 L24 6 L28 12 L26 18 L20 16 L16 20 L20 26 L18 28 Z" fill="#D71920"/>
        <text x="36" y="26" font-family="Arial, sans-serif" font-weight="900" font-size="24" fill="#D71920" letter-spacing="1">CADO</text>
      </g>
    </svg>`
  },
  {
    name: 'supreme.svg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 50">
      <rect width="180" height="50" fill="#ffffff"/>
      <text x="10" y="30" font-family="'Arial Black', sans-serif" font-weight="900" font-size="24" fill="#D71920" letter-spacing="-0.5">Supreme</text>
      <text x="12" y="42" font-family="Arial, sans-serif" font-weight="700" font-size="7.5" fill="#666666" letter-spacing="1">TOTAL PIPING SOLUTION</text>
    </svg>`
  },
  {
    name: 'jaquar.svg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50">
      <rect width="160" height="50" fill="#ffffff"/>
      <text x="20" y="33" font-family="'Times New Roman', serif" font-weight="700" font-style="italic" font-size="28" fill="#007A87" letter-spacing="0.5">Jaquar</text>
    </svg>`
  },
  {
    name: 'finolex.svg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50">
      <rect width="160" height="50" fill="#ffffff"/>
      <text x="15" y="32" font-family="'Arial Black', sans-serif" font-weight="900" font-size="25" fill="#0080C0" letter-spacing="-0.5">Finolex</text>
      <text x="120" y="24" font-family="Arial, sans-serif" font-weight="700" font-size="10" fill="#0080C0">®</text>
    </svg>`
  },
  {
    name: 'dowsil.svg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50">
      <rect width="160" height="50" fill="#ffffff"/>
      <text x="15" y="33" font-family="'Arial Black', sans-serif" font-weight="900" font-size="24" fill="#D71920" letter-spacing="1">DOWSIL</text>
    </svg>`
  },
  {
    name: 'astral.svg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50">
      <rect width="160" height="50" fill="#ffffff"/>
      <text x="10" y="30" font-family="'Arial Black', sans-serif" font-weight="900" font-size="20" fill="#0F3876" letter-spacing="0.5">ASTRAL</text>
      <text x="105" y="30" font-family="Arial, sans-serif" font-weight="700" font-size="14" fill="#C59B27">PIPES</text>
    </svg>`
  },
  {
    name: 'hafele.svg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50">
      <rect width="160" height="50" fill="#ffffff"/>
      <text x="15" y="34" font-family="'Arial Black', sans-serif" font-weight="900" font-size="24" fill="#D71920" letter-spacing="2">HÄFELE</text>
    </svg>`
  },
  {
    name: 'weber.svg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50">
      <rect width="160" height="50" fill="#ffffff"/>
      <text x="15" y="34" font-family="Arial, sans-serif" font-weight="900" font-size="26" fill="#1C3F7C" letter-spacing="-0.5">weber</text>
      <text x="15" y="44" font-family="Arial, sans-serif" font-weight="600" font-size="7" fill="#666666">SAINT-GOBAIN</text>
    </svg>`
  }
];

brands.forEach(b => {
  fs.writeFileSync(path.join(baseDir, 'brands', b.name), b.svg);
});

// 2. PRODUCT PACKAGING (Authentic CADO Bag Renders matching reference)
// Green 777 Bag
const cado777Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 440">
  <defs>
    <linearGradient id="greenBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00693E"/>
      <stop offset="60%" stop-color="#005A34"/>
      <stop offset="100%" stop-color="#004728"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.18"/>
    </filter>
  </defs>
  <!-- Bag Body with 3D feel -->
  <g filter="url(#shadow)">
    <path d="M 40 40 Q 160 30 280 40 L 295 400 Q 160 415 25 400 Z" fill="url(#greenBg)"/>
    <path d="M 40 40 L 280 40 L 275 60 L 45 60 Z" fill="#004728" opacity="0.6"/>
    <!-- Top Stitching -->
    <line x1="45" y1="50" x2="275" y2="50" stroke="#FFFFFF" stroke-dasharray="4,4" stroke-width="2"/>
    <!-- CADO Logo on Bag -->
    <rect x="70" y="80" width="180" height="42" rx="4" fill="#FFFFFF"/>
    <text x="160" y="112" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="#D71920" text-anchor="middle" letter-spacing="2">CADO</text>
    <!-- Model Code Ribbon -->
    <rect x="80" y="140" width="160" height="60" rx="6" fill="#FFFFFF" fill-opacity="0.15" stroke="#FFFFFF" stroke-width="1.5"/>
    <text x="160" y="162" font-family="Arial, sans-serif" font-weight="700" font-size="12" fill="#CBE5D4" text-anchor="middle" letter-spacing="2">TILE ADHESIVE</text>
    <text x="160" y="193" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="34" fill="#FFFFFF" text-anchor="middle">777</text>
    <!-- Application badge -->
    <rect x="60" y="225" width="200" height="30" rx="15" fill="#FFFFFF"/>
    <text x="160" y="245" font-family="Arial, sans-serif" font-weight="800" font-size="11.5" fill="#005A34" text-anchor="middle" letter-spacing="1">FOR FLOOR &amp; WALL</text>
    <!-- Subtext -->
    <text x="160" y="280" font-family="Arial, sans-serif" font-size="11" fill="#E2F1E8" text-anchor="middle">HIGH BONDING POLYMER MODIFIED</text>
    <text x="160" y="298" font-family="Arial, sans-serif" font-size="10.5" fill="#CBE5D4" text-anchor="middle">GREY / WHITE OPTIONS • MADE IN INDIA</text>
    <!-- Weight Stamp -->
    <rect x="50" y="340" width="65" height="45" rx="4" fill="#FFFFFF" fill-opacity="0.2"/>
    <text x="82" y="362" font-family="Arial Black, sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle">20</text>
    <text x="82" y="377" font-family="Arial, sans-serif" font-weight="700" font-size="10" fill="#FFFFFF" text-anchor="middle">KG</text>
    <!-- Quality Seal -->
    <circle cx="240" cy="360" r="22" fill="#D71920" stroke="#FFFFFF" stroke-width="2"/>
    <text x="240" y="364" font-family="Arial, sans-serif" font-weight="800" font-size="9" fill="#FFFFFF" text-anchor="middle">IS 15477</text>
  </g>
</svg>`;
fs.writeFileSync(path.join(baseDir, 'products', 'cado-777.svg'), cado777Svg);

// Red 666 Bag
const cado666Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 440">
  <defs>
    <linearGradient id="redBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E83023"/>
      <stop offset="50%" stop-color="#D71920"/>
      <stop offset="100%" stop-color="#B5121B"/>
    </linearGradient>
    <filter id="shadow2" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.18"/>
    </filter>
  </defs>
  <g filter="url(#shadow2)">
    <path d="M 40 40 Q 160 30 280 40 L 295 400 Q 160 415 25 400 Z" fill="url(#redBg)"/>
    <path d="M 40 40 L 280 40 L 275 60 L 45 60 Z" fill="#900C13" opacity="0.6"/>
    <!-- Top Stitching -->
    <line x1="45" y1="50" x2="275" y2="50" stroke="#FFFFFF" stroke-dasharray="4,4" stroke-width="2"/>
    <!-- CADO Logo on Bag -->
    <rect x="70" y="80" width="180" height="42" rx="4" fill="#FFFFFF"/>
    <text x="160" y="112" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="#D71920" text-anchor="middle" letter-spacing="2">CADO</text>
    <!-- Model Code Ribbon -->
    <rect x="80" y="140" width="160" height="60" rx="6" fill="#FFFFFF" fill-opacity="0.15" stroke="#FFFFFF" stroke-width="1.5"/>
    <text x="160" y="162" font-family="Arial, sans-serif" font-weight="700" font-size="12" fill="#FCE7E7" text-anchor="middle" letter-spacing="2">TILE ADHESIVE</text>
    <text x="160" y="193" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="34" fill="#FFFFFF" text-anchor="middle">666</text>
    <!-- Application badge -->
    <rect x="60" y="225" width="200" height="30" rx="15" fill="#FFFFFF"/>
    <text x="160" y="245" font-family="Arial, sans-serif" font-weight="800" font-size="11.5" fill="#D71920" text-anchor="middle" letter-spacing="1">FOR FLOOR &amp; WALL</text>
    <!-- Subtext -->
    <text x="160" y="280" font-family="Arial, sans-serif" font-size="11" fill="#FFFFFF" text-anchor="middle">STRONG &amp; DURABLE BONDING</text>
    <text x="160" y="298" font-family="Arial, sans-serif" font-size="10.5" fill="#FCE7E7" text-anchor="middle">EASY APPLICATION • MADE IN INDIA</text>
    <!-- Weight Stamp -->
    <rect x="50" y="340" width="65" height="45" rx="4" fill="#FFFFFF" fill-opacity="0.2"/>
    <text x="82" y="362" font-family="Arial Black, sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle">20</text>
    <text x="82" y="377" font-family="Arial, sans-serif" font-weight="700" font-size="10" fill="#FFFFFF" text-anchor="middle">KG</text>
    <!-- Quality Seal -->
    <circle cx="240" cy="360" r="22" fill="#171717" stroke="#FFFFFF" stroke-width="2"/>
    <text x="240" y="364" font-family="Arial, sans-serif" font-weight="800" font-size="9" fill="#FFFFFF" text-anchor="middle">GENUINE</text>
  </g>
</svg>`;
fs.writeFileSync(path.join(baseDir, 'products', 'cado-666.svg'), cado666Svg);

// Epoxy Grout Bag/Bucket
const cadoGroutSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 440">
  <defs>
    <linearGradient id="greyBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E2E8F0"/>
      <stop offset="50%" stop-color="#CBD5E1"/>
      <stop offset="100%" stop-color="#94A3B8"/>
    </linearGradient>
    <filter id="shadow3" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.18"/>
    </filter>
  </defs>
  <g filter="url(#shadow3)">
    <path d="M 40 40 Q 160 30 280 40 L 295 400 Q 160 415 25 400 Z" fill="url(#greyBg)"/>
    <path d="M 40 40 L 280 40 L 275 60 L 45 60 Z" fill="#64748B" opacity="0.6"/>
    <!-- Top Stitching -->
    <line x1="45" y1="50" x2="275" y2="50" stroke="#334155" stroke-dasharray="4,4" stroke-width="2"/>
    <!-- CADO Logo on Bag -->
    <rect x="70" y="80" width="180" height="42" rx="4" fill="#FFFFFF"/>
    <text x="160" y="112" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="#D71920" text-anchor="middle" letter-spacing="2">CADO</text>
    <!-- Model Code Ribbon -->
    <rect x="80" y="140" width="160" height="60" rx="6" fill="#1E293B" rx="6"/>
    <text x="160" y="162" font-family="Arial, sans-serif" font-weight="700" font-size="12" fill="#F87171" text-anchor="middle" letter-spacing="2">EPOXY GROUT</text>
    <text x="160" y="190" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="24" fill="#FFFFFF" text-anchor="middle">HIGH GRADE</text>
    <!-- Application badge -->
    <rect x="60" y="225" width="200" height="30" rx="15" fill="#D71920"/>
    <text x="160" y="245" font-family="Arial, sans-serif" font-weight="800" font-size="11" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">100% STAIN &amp; WATERPROOF</text>
    <!-- Subtext -->
    <text x="160" y="280" font-family="Arial, sans-serif" font-size="11" fill="#0F172A" font-weight="700" text-anchor="middle">FOR TILES AND STONE</text>
    <text x="160" y="298" font-family="Arial, sans-serif" font-size="10.5" fill="#334155" text-anchor="middle">CHEMICAL RESISTANT • INTERIOR &amp; EXTERIOR</text>
    <!-- Weight Stamp -->
    <rect x="50" y="340" width="65" height="45" rx="4" fill="#0F172A" fill-opacity="0.8"/>
    <text x="82" y="362" font-family="Arial Black, sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle">10</text>
    <text x="82" y="377" font-family="Arial, sans-serif" font-weight="700" font-size="10" fill="#FFFFFF" text-anchor="middle">KG</text>
  </g>
</svg>`;
fs.writeFileSync(path.join(baseDir, 'products', 'cado-epoxy-grout.svg'), cadoGroutSvg);

// 3. CATEGORY GRAPHICS
const categories = [
  { name: 'tile-adhesives.svg', title: 'Tile Adhesives', color: '#D71920' },
  { name: 'construction-chemicals.svg', title: 'Chemicals', color: '#0284C7' },
  { name: 'sealants-grouts.svg', title: 'Sealants & Grouts', color: '#059669' },
  { name: 'plumbing-fittings.svg', title: 'Plumbing', color: '#475569' },
  { name: 'bathroom-drainage.svg', title: 'Bathroom Drains', color: '#6366F1' },
  { name: 'tools-accessories.svg', title: 'Tools', color: '#EA580C' },
];

categories.forEach(cat => {
  const catSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <rect width="200" height="200" rx="8" fill="#F8FAFC"/>
    <rect x="15" y="15" width="170" height="170" rx="6" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
    <circle cx="100" cy="90" r="42" fill="${cat.color}" fill-opacity="0.12"/>
    <rect x="75" y="65" width="50" height="50" rx="6" fill="${cat.color}"/>
    <text x="100" y="150" font-family="Arial, sans-serif" font-weight="700" font-size="13" fill="#1E293B" text-anchor="middle">${cat.title}</text>
  </svg>`;
  fs.writeFileSync(path.join(baseDir, 'categories', cat.name), catSvg);
});

// 4. PROJECT GRAPHICS
const projects = [
  { name: 'residential-floors.svg', title: 'Residential Floors', sub: 'Premium Finish' },
  { name: 'bathroom-walls.svg', title: 'Bathroom Walls', sub: 'Durable & Elegant' },
  { name: 'commercial-projects.svg', title: 'Commercial Projects', sub: 'Trusted by Pros' },
  { name: 'outdoor-spaces.svg', title: 'Outdoor Spaces', sub: 'Weatherproof' },
];

projects.forEach(p => {
  const projSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260">
    <defs>
      <linearGradient id="grad-${p.name}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#334155"/>
        <stop offset="100%" stop-color="#0F172A"/>
      </linearGradient>
    </defs>
    <rect width="400" height="260" rx="8" fill="url(#grad-${p.name})"/>
    <rect x="20" y="20" width="360" height="220" rx="6" fill="#1E293B" opacity="0.6"/>
    <!-- Architectural grid lines -->
    <line x1="20" y1="130" x2="380" y2="130" stroke="#475569" stroke-width="1" stroke-dasharray="6,6"/>
    <line x1="200" y1="20" x2="200" y2="240" stroke="#475569" stroke-width="1" stroke-dasharray="6,6"/>
    <circle cx="200" cy="110" r="35" fill="#D71920" fill-opacity="0.2"/>
    <text x="200" y="116" font-family="Arial, sans-serif" font-weight="900" font-size="18" fill="#FFFFFF" text-anchor="middle">CADO</text>
    <text x="200" y="175" font-family="Arial, sans-serif" font-weight="700" font-size="16" fill="#F8FAFC" text-anchor="middle">${p.title}</text>
    <text x="200" y="196" font-family="Arial, sans-serif" font-weight="400" font-size="12" fill="#94A3B8" text-anchor="middle">${p.sub}</text>
  </svg>`;
  fs.writeFileSync(path.join(baseDir, 'projects', p.name), projSvg);
});

// 5. HERO IMAGES
const heroSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600">
  <defs>
    <linearGradient id="heroDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="40%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="600" fill="url(#heroDark)"/>
  <!-- Floor tile pattern representing tile adhesive installation -->
  <g opacity="0.15" stroke="#FFFFFF" stroke-width="1.5">
    <line x1="0" y1="300" x2="1200" y2="300"/>
    <line x1="0" y1="400" x2="1200" y2="400"/>
    <line x1="0" y1="500" x2="1200" y2="500"/>
    <line x1="200" y1="200" x2="200" y2="600"/>
    <line x1="450" y1="200" x2="450" y2="600"/>
    <line x1="700" y1="200" x2="700" y2="600"/>
    <line x1="950" y1="200" x2="950" y2="600"/>
  </g>
</svg>`;
fs.writeFileSync(path.join(baseDir, 'hero', 'hero-tile-installation.svg'), heroSvg);

console.log('Successfully generated authentic CADO graphic assets!');
