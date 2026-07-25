#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const TEMPLATES = join(ROOT, 'packages/site-generator/templates/sections');
const CLIENTS = join(ROOT, 'packages/site-generator/clients');
const MOODS = join(ROOT, 'packages/site-generator/design-system/moods');

const clientId = process.argv[2];
if (!clientId) {
  console.error('Usage: node scripts/generate-site.mjs <client-id> [--llm]');
  process.exit(1);
}

const clientDir = join(CLIENTS, clientId);
const imagesDir = join(clientDir, 'images');

if (!existsSync(clientDir)) {
  console.error(`Client directory not found: ${clientDir}`);
  process.exit(1);
}

// Load config
const config = JSON.parse(readFileSync(join(clientDir, 'config.json'), 'utf-8'));

// ============================================================
// CONFIG NORMALIZATION (clean stale fields for backward compat)
// ============================================================
// Helper: extract suburb from address
function extractSuburb(address) {
  const parts = address
    .replace(/^[^\w\s]+/, '')  // strip leading emoji/non-word chars
    .split(',')
    .map(s => s.trim().replace(/^\d+\s*/, ''))  // strip leading street numbers
    .filter(s => s.length > 3);
  // Find the first part that looks like a suburb (not a street/Jalan/No/Near)
  const skipPattern = /^(Near|No|Lot|Jalan|Lorong|Persiaran|Lebuh|Tingkat|Suite|Level|Floor|Block|Unit|Batu)\b/i;
  return parts.find(p => !skipPattern.test(p) && p.length > 3) || parts[0] || '';
}

// Clean area — derive from address if available, else clean in-place
if (config.area && /^(Near|No|\d)/i.test(config.area.trim())) {
  // Area is a street-level location — try to derive from full address
  if (config.address) {
    config.area = extractSuburb(config.address) || config.area;
  }
}

// Derive service_areas from area if missing
if (!config.service_areas || config.service_areas.length === 0) {
  config.service_areas = config.area ? [config.area] : [];
}

// Normalize google_rating (string "0" from API → 0 → falsy)
if (config.google_rating === '0' || config.google_rating === 0) {
  config.google_rating = null;
}

// Derive rating + review count from testimonials when D1 data is missing
const _testimonials = (config.testimonials || []).concat(
  (config.testimonials || []).length === 0
    ? [
        { name: 'Ahmad Faiz', area: 'Pelanggan', rating: 5, text: 'Servis cepat dan professional. Puas hati dengan hasil kerja!' },
        { name: 'Siti Norhaliza', area: 'Pelanggan', rating: 5, text: 'Harga berpatutan dan servis yang mesra. Confirm recommended!' },
        { name: 'Razif Kamaruddin', area: 'Pelanggan', rating: 4, text: 'Sampai on time, kerja kemas. Akan guna servis lagi.' },
      ]
    : []
);
if (_testimonials.length > 0) {
  if (!config.google_rating) {
    const avg = _testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / _testimonials.length;
    config.google_rating = Math.round(avg * 10) / 10;
  }
  if (!config.google_review_count || config.google_review_count === 0) {
    config.google_review_count = _testimonials.length;
  }
}
// Ensure established has a sensible default
if (!config.established) {
  config.established = '2018';
}

// Generate English tagline if missing
if (!config.tagline_en) {
  const TAGLINES_EN = {
    'aircond-contractor': `Fast & Reliable Aircond Service in ${config.area}`,
    'plumbing': `Trusted Plumbing Services in ${config.area}`,
    'electrical': `Professional Electrical Services in ${config.area}`,
    'renovation': `Quality Renovation & Remodeling in ${config.area}`,
    'general': `Professional Services in ${config.area}`,
  };
  const nicheKey = config.niche || (config.niches && config.niches[0]) || 'general';
  config.tagline_en = TAGLINES_EN[nicheKey] || TAGLINES_EN['general'];
}

// Pull social URLs from social{} if missing at root (old config compat)
if (!config.facebook_url && config.social?.facebook_url) config.facebook_url = config.social.facebook_url;
if (!config.instagram_url && config.social?.instagram_url) config.instagram_url = config.social.instagram_url;
if (!config.tiktok_url && config.social?.tiktok_url) config.tiktok_url = config.social.tiktok_url;

// Load mood tokens
const moodDir = join(MOODS, config.mood || 'trustworthy-local');
if (!existsSync(moodDir)) {
  console.error(`Mood directory not found: ${moodDir}`);
  process.exit(1);
}
const tokens = JSON.parse(readFileSync(join(moodDir, 'tokens.json'), 'utf-8'));

// ============================================================
// HELPER: deterministic variant picker (seeded by client ID)
// ============================================================
function seededRandom(seed) {
  const hash = crypto.createHash('md5').update(seed.toString()).digest('hex');
  const intVal = parseInt(hash.substring(0, 8), 16);
  return intVal / 0xFFFFFFFF;
}

function pickVariant(seed, poolSize) {
  return Math.floor(seededRandom(seed) * poolSize) + 1;
}

function hashClientId(id) {
  const hash = crypto.createHash('md5').update(id).digest('hex');
  return parseInt(hash.substring(0, 16), 16);
}

// ============================================================
// GENERATE CSS VARS from mood tokens
// ============================================================
function generateCSSVars(t) {
  const c = t.colors;
  const s = t.style;
  const radius = s.radius === 'xl' ? '0.75rem' : '0';
  const shadow = s.shadow === 'soft' ? '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)' : `4px 4px 0px 0px ${c.primary}`;
  return `
    :root {
      --color-primary: ${c.primary};
      --color-primary-soft: ${c.primary_soft || '#2D6A4F'};
      --color-accent: ${c.accent || '#F59E0B'};
      --color-accent-soft: ${c.accent_soft || '#FCD34D'};
      --color-bg: ${c.background || '#F8F4F0'};
      --color-surface: ${c.surface || '#FFFFFF'};
      --color-text: ${c.text || '#1C1917'};
      --color-border: ${c.border || '#E7E5E4'};
      --color-muted: ${c.text_soft || '#57534E'};
      --font-heading: '${t.typography.heading_font}', sans-serif;
      --radius-style: ${radius};
      --shadow-style: ${shadow};
      --color-lang-toggle-bg: ${c.border || '#E7E5E4'};
      --color-lang-btn: ${c.text_soft || '#78716C'};
    }
  `.trim();
}

// ============================================================
// SHARED DATA
// ============================================================
const DEFAULT_SERVICES = {
  'aircond-contractor': ['Servis Aircond', 'Cuci Aircond', 'Repair Aircond', 'Pemasangan Baru'],
  'plumbing': ['Servis Paip', 'Baiki Bocor', 'Saluran Tersumbat', 'Pemasangan Paip'],
  'electrical': ['Servis Elektrik', 'Pendawaian', 'Pemasangan Lampu', 'Baiki Soket'],
  'renovation': ['Renovation Rumah', 'Ubahsuai Dapur', 'Cat & Plaster', 'Baiki Struktur'],
  'general': ['Servis', 'Repair', 'Maintenance', 'Installation'],
};
const SERVICES_EN = {
  'aircond-contractor': ['Aircond Service', 'Aircond Cleaning', 'Aircond Repair', 'New Installation'],
  'plumbing': ['Plumbing Service', 'Leak Repair', 'Drain Unclogging', 'Pipe Installation'],
  'electrical': ['Electrical Service', 'Wiring', 'Light Installation', 'Socket Repair'],
  'renovation': ['Home Renovation', 'Kitchen Remodel', 'Paint & Plaster', 'Structural Repair'],
  'general': ['Service', 'Repair', 'Maintenance', 'Installation'],
};
const DEFAULT_TESTIMONIALS = [
  { name: 'Ahmad Faiz', nameEn: 'Ahmad Faiz', area: 'Pelanggan', areaEn: 'Customer', rating: 5, text: 'Servis cepat dan professional. Puas hati dengan hasil kerja!', textEn: 'Fast and professional service. Very satisfied with the results!' },
  { name: 'Siti Norhaliza', nameEn: 'Siti Norhaliza', area: 'Pelanggan', areaEn: 'Customer', rating: 5, text: 'Harga berpatutan dan servis yang mesra. Confirm recommended!', textEn: 'Fair prices and friendly service. Highly recommended!' },
  { name: 'Razif Kamaruddin', nameEn: 'Razif Kamaruddin', area: 'Pelanggan', areaEn: 'Customer', rating: 4, text: 'Sampai on time, kerja kemas. Akan guna servis lagi.', textEn: 'Arrived on time, clean work. Will use their service again.' },
];

// ============================================================
// GENERATE INNER CONTENT
// ============================================================
function generateServiceCards(variant, services, niche, servicesEn) {
  if (!services || services.length === 0) {
    services = DEFAULT_SERVICES[niche] || DEFAULT_SERVICES['general'];
    servicesEn = SERVICES_EN[niche] || DEFAULT_SERVICES['general'];
  }
  if (!servicesEn || servicesEn.length !== services.length) servicesEn = services;
  const icons = {
    'aircond-contractor': ['❄️', '🔧', '🛠️', '💨'],
    'plumbing': ['🔧', '💧', '🪠', '🚿'],
    'electrical': ['⚡', '💡', '🔌', '🔋'],
    'renovation': ['🏠', '🪚', '🎨', '🔨'],
    'general': ['🛠️', '🔧', '⚙️', '📋'],
  };
  const iconSet = icons[niche] || icons['general'];
  
  if (variant === 1) {
    // Horizontal cards with image
    return services.map((s, i) => {
      const sEn = servicesEn[i] || s;
      const imgFile = i < 3 ? `service-${i+1}.webp` : `service-3.webp`;
      const imgExists = existsSync(join(imagesDir, imgFile));
      const hasImage = imgExists && i < 3;
      return `
<div class="flex flex-col sm:flex-row overflow-hidden transition-all hover:-translate-y-0.5" style="background:var(--color-surface);border:2px solid var(--color-border);box-shadow:var(--shadow-style);">
      ${hasImage ? `<div class="sm:w-2/5 overflow-hidden"><img src="images/${imgFile}" alt="${s}" class="w-full h-36 sm:h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" /></div>` : ''}
  <div class="flex-1 p-5 flex flex-col justify-center">
    <h3 class="font-bold text-base" style="color:var(--color-text);font-family:var(--font-heading);" data-bm="${s}" data-en="${sEn}">${s}</h3>
  </div>
</div>`;
    }).join('\n');
  }
  
  if (variant === 2) {
    // Asymmetric — all cards get images
    return services.map((s, i) => {
      const sEn = servicesEn[i] || s;
      const imgIdx = (i % 3) + 1;
      const imgFile = `service-${imgIdx}.webp`;
      const imgExists = existsSync(join(imagesDir, imgFile));
      const isFeatured = i === 0 || i === services.length - 1;
      return `
<div class="${isFeatured ? 'md:col-span-2' : ''} flex flex-col sm:flex-row overflow-hidden" style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-style);box-shadow:0 1px 3px rgba(0,0,0,0.06);">
  ${imgExists ? `<div class="sm:w-2/5 overflow-hidden"><img src="images/${imgFile}" alt="${s}" class="w-full h-36 sm:h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" /></div>` : ''}
  <div class="flex-1 p-5 flex flex-col justify-center">
    <h3 class="font-bold text-sm md:text-base" style="color:var(--color-text);font-family:var(--font-heading);" data-bm="${s}" data-en="${sEn}">${s}</h3>
  </div>
</div>`;
    }).join('\n');
  }
  
  if (variant === 3) {
    // Vertical icon cards
    return services.map((s, i) => {
      const sEn = servicesEn[i] || s;
      const iconChar = iconSet[i % iconSet.length];
      return `
<div class="p-5 md:p-6 text-center hover-lift" style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-style);">
  <span class="text-3xl block mb-3">${iconChar}</span>
  <h3 class="font-bold text-sm leading-tight" style="color:var(--color-text);font-family:var(--font-heading);" data-bm="${s}" data-en="${sEn}">${s}</h3>
</div>`;
    }).join('\n');
  }
  
  if (variant === 4) {
    // Full-width rows
    return services.map((s, i) => {
      const sEn = servicesEn[i] || s;
      const imgIdx = i < 3 ? i + 1 : 3;
      const imgFile = `service-${imgIdx}.webp`;
      const imgExists = existsSync(join(imagesDir, imgFile));
      const bgClass = i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)';
      return `
<div class="flex flex-col md:flex-row ${i % 2 === 1 ? 'md:flex-row-reverse' : ''} items-center" style="background:${bgClass};">
  ${imgExists ? `<div class="md:w-1/2 overflow-hidden"><img src="images/${imgFile}" alt="${s}" class="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" loading="lazy" /></div>` : ''}
  <div class="md:w-1/2 p-6 md:p-10">
    <h3 class="text-xl font-bold" style="color:var(--color-text);font-family:var(--font-heading);" data-bm="${s}" data-en="${sEn}">${s}</h3>
  </div>
</div>`;
    }).join('\n');
  }
  
  if (variant === 5) {
    // Pricing table
    const priceRanges = {
      'aircond-contractor': ['RM80 - RM250', 'RM150 - RM500', 'RM80 - RM200', 'RM50 - RM150'],
      'plumbing': ['RM100 - RM300', 'RM80 - RM200', 'RM60 - RM150', 'RM200 - RM600'],
      'electrical': ['RM100 - RM400', 'RM50 - RM150', 'RM80 - RM250', 'RM80 - RM200'],
      'renovation': ['RM500 - RM3000', 'RM200 - RM1000', 'RM1000 - RM5000', 'RM300 - RM1500'],
      'general': ['RM50 - RM200', 'RM50 - RM200', 'RM50 - RM200', 'RM100 - RM500'],
    };
    const prices = priceRanges[niche] || priceRanges['general'];
    return services.map((s, i) => {
      const sEn = servicesEn[i] || s;
      const isPopular = i === 1;
      const price = prices[i % prices.length];
      return `
<div class="relative p-5 md:p-6 hover-lift" style="background:var(--color-surface);border:2px solid ${isPopular ? 'var(--color-accent)' : 'var(--color-border)'};border-radius:var(--radius-style);">
  ${isPopular ? `<span class="absolute -top-2.5 right-4 px-3 py-0.5 text-xs font-black uppercase tracking-wider" style="background:var(--color-accent);color:#fff;border-radius:var(--radius-style);" data-bm="Popular" data-en="Popular">Popular</span>` : ''}
  <h3 class="font-bold text-base mb-1" style="color:var(--color-text);font-family:var(--font-heading);" data-bm="${s}" data-en="${sEn}">${s}</h3>
  <p class="text-lg font-black" style="color:var(--color-primary);">${price}</p>
  <a href="https://wa.me/${config.whatsapp || ''}?text=Hi%2C%20saya%20nak%20tanya%20pasal%20${encodeURIComponent(s.toLowerCase())}" class="mt-3 inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider" style="background:#25D366;color:#fff;border-radius:var(--radius-style);" data-bm="Tempah" data-en="Book">Tempah</a>
</div>`;
    }).join('\n');
  }
  
  return '';
}

function generateTestimonialCards(variant, testimonials, testimonialsEn) {
  if (!testimonials || testimonials.length === 0) {
    testimonials = DEFAULT_TESTIMONIALS;
    testimonialsEn = DEFAULT_TESTIMONIALS.map(t => ({
      name: t.nameEn || t.name,
      area: t.areaEn || t.area,
      rating: t.rating,
      text: t.textEn || t.text,
    }));
  }
  if (!testimonialsEn || testimonialsEn.length !== testimonials.length) testimonialsEn = testimonials;
  
  function tEn(t, i) { return testimonialsEn[i] || t; }
  
  if (variant === 5) {
    // Avatar large
    return testimonials.map((t, i) => {
      const te = tEn(t, i);
      const initials = (t.name || '??').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
      const stars = '★'.repeat(t.rating || 5) + '☆'.repeat(5 - (t.rating || 5));
      return `
<div class="flex flex-col sm:flex-row items-start gap-4 p-5 reveal ${i === 1 ? 'reveal-delay-1' : i === 2 ? 'reveal-delay-2' : ''}" style="background:var(--color-surface);border:2px solid var(--color-border);box-shadow:var(--shadow-style);">
  <div class="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center text-xl font-black" style="background:var(--color-primary);color:#fff;border-radius:9999px;">${initials}</div>
  <div class="flex-1">
    <div class="flex items-center gap-2 mb-1">
      <span class="font-bold text-sm" style="color:var(--color-text);" data-bm="${t.name}" data-en="${te.name || t.name}">${t.name}</span>
      ${t.area ? `<span class="text-xs" style="color:var(--color-muted);" data-bm="${t.area}" data-en="${te.area || t.area}">${t.area}</span>` : ''}
    </div>
    <div style="color:var(--color-accent);font-size:14px;letter-spacing:2px;">${stars}</div>
    <p class="text-sm mt-2 leading-relaxed" style="color:var(--color-text);" data-bm="${t.text}" data-en="${te.text || t.text}">"${t.text}"</p>
  </div>
</div>`;
    }).join('\n');
  }
  
  // Variants 1-4: grid cards
  return testimonials.map((t, i) => {
    const te = tEn(t, i);
    const initials = (t.name || '??').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    const stars = '★'.repeat(t.rating || 5) + '☆'.repeat(5 - (t.rating || 5));
    const delay = i === 0 ? '' : i === 1 ? 'reveal-delay-1' : 'reveal-delay-2';
    const cardBg = variant === 3 ? 'var(--color-bg)' : 'var(--color-surface)';
    
    if (variant === 4) {
      // Carousel
      return `
<div class="snap-center shrink-0 w-[85vw] md:w-auto p-4" style="background:${cardBg};border:2px solid var(--color-border);box-shadow:var(--shadow-style);">
  <div class="flex items-center gap-2 mb-2">
    <span class="w-8 h-8 flex items-center justify-center text-xs font-black rounded-full" style="background:var(--color-primary);color:#fff;">${initials}</span>
    <div>
      <span class="font-bold text-sm" style="color:var(--color-text);" data-bm="${t.name}" data-en="${te.name || t.name}">${t.name}</span>
      ${t.area ? `<span class="text-xs block" style="color:var(--color-muted);" data-bm="${t.area}" data-en="${te.area || t.area}">${t.area}</span>` : ''}
    </div>
  </div>
  <div style="color:var(--color-accent);font-size:13px;letter-spacing:2px;">${stars}</div>
  <p class="text-sm mt-2 leading-relaxed" style="color:var(--color-text);" data-bm="${t.text}" data-en="${te.text || t.text}">"${t.text}"</p>
</div>`;
    }
    
    // Variants 1-3: grid cards
    return `
<div class="p-5 reveal ${delay}" style="background:${cardBg};border:2px solid var(--color-border);box-shadow:var(--shadow-style);${variant === 2 ? 'border-radius:var(--radius-style);' : ''}">
  <div style="color:var(--color-accent);font-size:14px;letter-spacing:2px;margin-bottom:8px;">${stars}</div>
  <p class="text-sm leading-relaxed mb-3" style="color:var(--color-text);" data-bm="${t.text}" data-en="${te.text || t.text}">"${t.text}"</p>
  <div class="flex items-center gap-2 pt-3" style="border-top:1px solid var(--color-border);">
    <span class="w-7 h-7 flex items-center justify-center text-[10px] font-black rounded-full" style="background:var(--color-primary);color:#fff;">${initials}</span>
    <div>
      <span class="font-bold text-xs" style="color:var(--color-text);" data-bm="${t.name}" data-en="${te.name || t.name}">${t.name}</span>
      ${t.area ? `<span class="text-[10px] block" style="color:var(--color-muted);" data-bm="${t.area}" data-en="${te.area || t.area}">${t.area}</span>` : ''}
    </div>
  </div>
</div>`;
  }).join('\n');
}

function generateServiceOptions(services, servicesEn, niche) {
  if (!services || services.length === 0) {
    services = DEFAULT_SERVICES[niche] || DEFAULT_SERVICES['general'];
    servicesEn = SERVICES_EN[niche] || DEFAULT_SERVICES['general'];
  }
  if (!servicesEn || servicesEn.length !== services.length) servicesEn = services;
  return services.map((s, i) => `<option value="${s}" data-bm="${s}" data-en="${servicesEn[i] || s}">${s}</option>`).join('\n      ');
}

function generateServiceAreasList(areas, areasEn) {
  if (!areas || areas.length === 0) return '<li>Area sekitar</li>';
  if (!areasEn || areasEn.length !== areas.length) areasEn = areas;
  return areas.map((a, i) => `<li data-bm="${a}" data-en="${areasEn[i] || a}">${a}</li>`).join('\n');
}

function generateServiceAreasText(areas) {
  if (!areas || areas.length === 0) return 'Area sekitar';
  if (areas.length === 1) return areas[0];
  return areas.slice(0, -1).join(', ') + ' & ' + areas[areas.length - 1];
}

function generateFAQItems(niche) {
  const faqs = {
    'aircond-contractor': [
      { qBM: 'Apa servis aircond yang disediakan?', qEN: 'What aircond services do you provide?', aBM: 'Kami sediakan servis cuci aircond, pemasangan baru, pembaikan, dan top-up gas. Servis untuk semua jenama utama.', aEN: 'We provide aircond cleaning, new installation, repair, and gas top-up. Services for all major brands.' },
      { qBM: 'Berapa lama tempoh siap servis?', qEN: 'How long does service take?', aBM: 'Servis biasa ambil 30 minit hingga 1 jam. Pemasangan baru ambil 2-4 jam bergantung pada kerumitan.', aEN: 'Regular service takes 30 minutes to 1 hour. New installation takes 2-4 hours depending on complexity.' },
      { qBM: 'Area servis mana yang kami cover?', qEN: 'What areas do you cover?', aBM: 'Kami cover {{SERVICE_AREAS_LIST}}. Call kami untuk area lain.', aEN: 'We cover {{SERVICE_AREAS_LIST}}. Call us for other areas.' },
      { qBM: 'Ada warranty untuk servis?', qEN: 'Is there a warranty?', aBM: 'Ya, kami bagi warranty untuk servis dan pemasangan. Detail warranty akan diterangkan sebelum kerja bermula.', aEN: 'Yes, we provide warranty for service and installation. Details will be explained before work starts.' },
      { qBM: 'Cara nak booking servis?', qEN: 'How to book a service?', aBM: 'WhatsApp kami terus atau call. Kami akan arrange masa yang sesuai untuk awak.', aEN: 'WhatsApp or call us directly. We\'ll arrange a convenient time for you.' },
    ],
    'plumbing': [
      { qBM: 'Apa servis paip yang disediakan?', qEN: 'What plumbing services do you provide?', aBM: 'Kami sediakan pembaikan paip bocor, pemasangan paip baru, cuci saluran tersumbat, dan pemasangan tangki air.', aEN: 'We provide leak repair, new pipe installation, drain unclogging, and water tank installation.' },
      { qBM: 'Area servis mana?', qEN: 'What areas do you serve?', aBM: 'Kami cover {{SERVICE_AREAS_LIST}}. Untuk area lain, tanya kami dulu.', aEN: 'We cover {{SERVICE_AREAS_LIST}}. For other areas, please ask us.' },
      { qBM: 'Berapa cepat sampai untuk kecemasan?', qEN: 'How fast for emergencies?', aBM: 'Untuk kecemasan paip bocor atau tersumbat teruk, kami sampai dalam 30-60 minit.', aEN: 'For emergency leaks or severe blockages, we arrive within 30-60 minutes.' },
      { qBM: 'Ada warranty?', qEN: 'Do you offer warranty?', aBM: 'Ya, semua servis ada warranty. Terma dan kondisi akan diterangkan sebelum kerja.', aEN: 'Yes, all services come with warranty. Terms explained before work begins.' },
      { qBM: 'Cara nak booking?', qEN: 'How to book?', aBM: 'WhatsApp atau call kami. Kami akan hantar teknisi ikut masa yang sesuai.', aEN: 'WhatsApp or call us. We\'ll send a technician at a suitable time.' },
    ],
    'electrical': [
      { qBM: 'Apa servis elektrik yang disediakan?', qEN: 'What electrical services do you provide?', aBM: 'Kami sediakan pendawaian rumah dan kedai, pembaikan suis dan soket, pemasangan lampu dan kipas, dan pemeriksaan elektrik.', aEN: 'We provide house and shop wiring, switch and socket repair, light and fan installation, and electrical inspection.' },
      { qBM: 'Ada servis kecemasan?', qEN: 'Do you offer emergency service?', aBM: 'Ya, kami ada servis kecemasan 24 jam. Untuk kes bahaya seperti wayar terbakar atau terkena air, call kami segera.', aEN: 'Yes, we offer 24/7 emergency service. For dangerous cases like burnt wires or water exposure, call us immediately.' },
      { qBM: 'Area servis mana?', qEN: 'What areas do you serve?', aBM: 'Kami cover {{SERVICE_AREAS_LIST}}. Call untuk area lain.', aEN: 'We cover {{SERVICE_AREAS_LIST}}. Call for other areas.' },
      { qBM: 'Ada warranty?', qEN: 'Is there a warranty?', aBM: 'Ya, semua kerja elektrik ada warranty. Kami guna komponen yang mematuhi piawaian Suruhanjaya Tenaga.', aEN: 'Yes, all electrical work comes with warranty. We use components compliant with Energy Commission standards.' },
      { qBM: 'Cara nak booking?', qEN: 'How to book?', aBM: 'WhatsApp atau call kami. Kami akan arrange ikut masa yang sesuai.', aEN: 'WhatsApp or call us. We\'ll arrange a convenient time.' },
    ],
    'renovation': [
      { qBM: 'Apa servis renovation yang disediakan?', qEN: 'What renovation services do you provide?', aBM: 'Kami sediakan renovation rumah, ubahsuai dapur dan bilik air, kerja cat dan plaster, dan pembaikan struktur ringan.', aEN: 'We provide home renovation, kitchen and bathroom remodeling, painting and plastering, and light structural repairs.' },
      { qBM: 'Berapa lama renovation ambil masa?', qEN: 'How long does renovation take?', aBM: 'Bergantung pada skop kerja. Renovation kecil ambil 1-3 hari, yang besar 1-4 minggu. Kami akan bagi timeline yang jelas.', aEN: 'Depends on scope. Small renovations take 1-3 days, larger ones 1-4 weeks. We\'ll provide a clear timeline.' },
      { qBM: 'Area servis mana?', qEN: 'What areas do you serve?', aBM: 'Kami cover {{SERVICE_AREAS_LIST}}. Untuk area lain, tanya kami.', aEN: 'We cover {{SERVICE_AREAS_LIST}}. For other areas, please ask.' },
      { qBM: 'Ada warranty?', qEN: 'Do you offer warranty?', aBM: 'Ya, semua hasil renovation ada warranty. Kami guna material berkualiti.', aEN: 'Yes, all renovation work comes with warranty. We use quality materials.' },
      { qBM: 'Boleh minta sebut harga?', qEN: 'Can I get a quote?', aBM: 'Ya, kami bagi sebut harga percuma tanpa komitmen. WhatsApp kami untuk appointment.', aEN: 'Yes, we provide free quotes with no obligation. WhatsApp us for an appointment.' },
    ],
  };
  const items = faqs[niche] || faqs['general'] || faqs['aircond-contractor'];
  
  return items.map((faq, i) => `
<div class="border" style="border-color:var(--color-border);border-radius:var(--radius-style);overflow:hidden;">
    <button onclick="toggleFaq(this)" class="w-full flex items-center justify-between p-4 text-left font-bold text-sm transition-all" style="background:var(--color-surface);color:var(--color-text);font-family:var(--font-heading);"><span data-bm="${faq.qBM}" data-en="${faq.qEN}">${faq.qBM}</span> <span class="faq-icon text-lg transition-transform duration-200" style="color:var(--color-muted);">+</span></button>
  <div class="faq-answer hidden px-4 pb-4 text-sm leading-relaxed" style="color:var(--color-muted);background:var(--color-surface);" data-bm="${faq.aBM}" data-en="${faq.aEN}">${faq.aBM}</div>
</div>`).join('\n');
}

function generateSocialLinks(insta, fb, tt) {
  const platforms = [
    { handle: insta, label: 'Instagram', url: insta ? `https://instagram.com/${insta.replace('@','')}` : null, svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="#fff"/><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z" fill="none"/></svg>' },
    { handle: fb, label: 'Facebook', url: fb || null, svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>' },
    { handle: tt, label: 'TikTok', url: tt ? `https://tiktok.com/@${tt.replace('@','')}` : null, svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.89 2.89 2.89 0 0 1 2.88-2.89c.33 0 .64.06.94.15V8.78a6.37 6.37 0 0 0-.94-.07 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.75a8.28 8.28 0 0 0 4.94 1.56v-3.4a4.87 4.87 0 0 1-1.42-.22z"/></svg>' },
  ];
  return platforms.map(p => {
    if (p.url) {
      return `<a href="${p.url}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:999px;color:var(--color-muted);transition:color 0.2s,background 0.2s;" onmouseover="this.style.color='var(--color-primary)';this.style.background='var(--color-bg)';" onmouseout="this.style.color='var(--color-muted)';this.style.background='transparent';" aria-label="${p.label}">${p.svg}</a>`;
    }
    return `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:999px;color:var(--color-muted);opacity:0.55;cursor:default;" aria-label="${p.label} (tiada)">${p.svg}</span>`;
  }).join('\n      ');
}

function getPageTitle(config) {
  const nicheLabels = {
    'aircond-contractor': 'Aircond',
    'plumbing': 'Paip',
    'electrical': 'Elektrik',
    'renovation': 'Renovation',
    'general': 'Servis',
  };
  const label = nicheLabels[config.niche || (config.niches && config.niches[0])] || 'Servis';
  return {
    bm: `${config.business_name} — Pakar ${label} ${config.area} | ${config.tagline || ''}`,
    en: `${config.business_name} — ${label} Expert ${config.area} | ${config.tagline_en || config.tagline || ''}`,
  };
}

// ============================================================
// MAIN ASSEMBLY
// ============================================================
const seed = hashClientId(clientId);
const variant = {
  hero: pickVariant(`${seed}-1`, 5),
  services: pickVariant(`${seed}-2`, 5),
  testimonials: pickVariant(`${seed}-3`, 5),
  cta: pickVariant(`${seed}-4`, 5),
  ctaPosition: pickVariant(`${seed}-5`, 3), // 1=after-testimonials, 2=after-services, 3=after-contact
};

console.log(`Generating site for: ${config.business_name}`);
console.log(`  Hero: variant ${variant.hero}`);
console.log(`  Services: variant ${variant.services}`);
console.log(`  Testimonials: variant ${variant.testimonials}`);
console.log(`  CTA: variant ${variant.cta} (position ${variant.ctaPosition})`);
console.log(`  Mood: ${config.mood}`);

// Normalize niche field (backward-compat: old configs had niches[] array)
const niche = config.niche || (config.niches && config.niches[0]) || 'general';

// Generate all data
const cssVars = generateCSSVars(tokens);
const pageTitle = getPageTitle(config);
const googleFontsUrl = tokens.typography.google_fonts_url;

const logoPath = join(imagesDir, 'logo.svg');
const logoExists = existsSync(logoPath);
const logoHtml = logoExists ? `<img src="images/logo.svg" alt="${config.business_name}" style="height:40px;width:auto;" />` : '';

const heroImage = existsSync(join(imagesDir, 'hero.webp')) ? 'images/hero.webp' : 'images/gallery-1.webp';

const servicesHtml = generateServiceCards(variant.services, config.services, niche, config.services_en);
const testimonialsHtml = generateTestimonialCards(variant.testimonials, config.testimonials, config.testimonials_en);
const areasList = generateServiceAreasList(config.service_areas, config.service_areas_en);
const areasText = generateServiceAreasText(config.service_areas);
const faqHtml = generateFAQItems(niche);

// Conditional social handles
const insta = config.instagram_url ? config.instagram_url.replace('https://www.instagram.com/', '@').split('/')[0] : (config.social?.instagram_handle ? `@${config.social.instagram_handle}` : '');
const fb = config.facebook_url || '';
const tt = config.tiktok_url ? config.tiktok_url.replace('https://www.tiktok.com/@', '@').split('?')[0] : '';

// WhatsApp prefill text
const waTextBM = encodeURIComponent(`Hi, saya nak tanya pasal servis`);
const waTextEN = encodeURIComponent(`Hi, I'd like to ask about your services`);

// Common data context for all templates
const ctx = {
  BUSINESS_NAME: config.business_name,
  TAGLINE: config.tagline || '',
  TAGLINE_EN: config.tagline_en || config.tagline || '',
  PHONE: config.phone || '',
  WHATSAPP: config.whatsapp || '',
  AREA: config.area || '',
  ESTABLISHED: config.established || '',
  GOOGLE_RATING: config.google_rating != null ? String(config.google_rating) : '',
  GOOGLE_REVIEW_COUNT: config.google_review_count != null ? String(config.google_review_count) : '',
  INSTAGRAM_HANDLE: insta,
  FACEBOOK_HANDLE: fb,
  TIKTOK_HANDLE: tt,
  NICHE: niche,
  MOOD: config.mood || '',
  YEAR: '2026',
  SERVICE_AREAS_HTML: areasList,
  SERVICE_AREAS_LIST: areasText,
  HERO_IMAGE: heroImage,
  LOGO_HTML: logoHtml,
  CSS_VARS: cssVars,
  GOOGLE_FONTS_URL: googleFontsUrl ? `<link href="${googleFontsUrl}" rel="stylesheet" />` : '',
  PAGE_TITLE_BM: pageTitle.bm,
  PAGE_TITLE_EN: pageTitle.en,
  SERVICES_HTML: servicesHtml,
  SERVICE_OPTIONS: generateServiceOptions(config.services, config.services_en, niche),
  TESTIMONIALS_HTML: testimonialsHtml,
  FAQ_ITEMS_HTML: faqHtml,
  WHATSAPP_TEXT_BM: waTextBM,
  WHATSAPP_TEXT_EN: waTextEN,
  SOCIAL_LINKS_HTML: generateSocialLinks(insta, fb, tt),
};

// Fill placeholders in a template string
function fill(template) {
  let result = template;
  for (const [key, value] of Object.entries(ctx)) {
    result = result.replaceAll(`{{${key}}}`, value ?? '');
  }
  return result;
}

// Load and fill a template file
function loadAndFill(filepath) {
  if (!existsSync(filepath)) {
    console.warn(`  Warning: ${filepath} not found, skipping`);
    return '';
  }
  return fill(readFileSync(filepath, 'utf-8'));
}

// Assemble all sections
const head = loadAndFill(join(TEMPLATES, 'common/head.html'));
const botPromo = loadAndFill(join(TEMPLATES, 'common/bot-promo.html'));
const nav = loadAndFill(join(TEMPLATES, 'common/nav.html'));
const variantNames = {
  hero: { 1: 'split', 2: 'fullwidth', 3: 'centered', 4: 'minimal', 5: 'gallery-mosaic' },
  services: { 1: 'horizontal-cards', 2: 'asymmetric', 3: 'vertical-icons', 4: 'fullwidth-row', 5: 'pricing-table' },
  testimonials: { 1: 'hard-shadow', 2: 'soft-shadow', 3: 'warm-cards', 4: 'carousel', 5: 'avatar-large' },
  cta: { 1: 'urgent-dark', 2: 'polished-dark', 3: 'green-badge', 4: 'green-minimal', 5: 'gradient-feature' },
};
const hero = loadAndFill(join(TEMPLATES, `hero/variant-${variant.hero}-${variantNames.hero[variant.hero]}.html`));
const services = loadAndFill(join(TEMPLATES, `services/variant-${variant.services}-${variantNames.services[variant.services]}.html`));
const gallery = loadAndFill(join(TEMPLATES, 'common/gallery.html'));
const testimonials = loadAndFill(join(TEMPLATES, `testimonials/variant-${variant.testimonials}-${variantNames.testimonials[variant.testimonials]}.html`));
const cta = loadAndFill(join(TEMPLATES, `cta/variant-${variant.cta}-${variantNames.cta[variant.cta]}.html`));
const contact = loadAndFill(join(TEMPLATES, 'common/contact-form.html'));
const faq = loadAndFill(join(TEMPLATES, 'common/faq.html'));
const footer = loadAndFill(join(TEMPLATES, 'common/footer.html'));
const scripts = loadAndFill(join(TEMPLATES, 'common/scripts.html'));

// Determine section order
const sections = [head, botPromo, nav, hero, services, gallery, testimonials, contact, faq, footer, scripts];

// Insert CTA at the right position
const ctaPositions = {
  1: 7,  // after testimonials (index 7)
  2: 5,  // after services (index 5)
  3: 9,  // after contact (index 9)
};
const ctaIdx = ctaPositions[variant.ctaPosition] || 7;
sections.splice(ctaIdx, 0, cta);

// FAQ accordion toggle script
const faqScript = `
<script>
function toggleFaq(btn){
  var answer=btn.nextElementSibling;
  var isHidden=answer.classList.contains('hidden');
  document.querySelectorAll('.faq-answer').forEach(function(el){el.classList.add('hidden');var icon=el.previousElementSibling.querySelector('.faq-icon');if(icon)icon.textContent='+';});
  if(isHidden){answer.classList.remove('hidden');var icon=btn.querySelector('.faq-icon');if(icon)icon.textContent='−';}
}
</script>`;
sections.splice(sections.indexOf(faq) + 1, 0, faqScript);

const finalHtml = fill(sections.join('\n'));

// Write output
writeFileSync(join(clientDir, 'index.html'), finalHtml, 'utf-8');
console.log(`\n✅ index.html written: ${join(clientDir, 'index.html')} (${finalHtml.split('\n').length} lines)`);

const deployUrl = `https://preview.pintarweb.com/${clientId}/`;
console.log(`\n📌 Demo site generated at: ${join(clientDir, 'index.html')}`);
console.log(`📌 Preview URL (after deploy): ${deployUrl}`);
