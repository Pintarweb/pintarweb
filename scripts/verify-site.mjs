#!/usr/bin/env node
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const LEAD_ID = process.argv[2];
if (!LEAD_ID) {
  console.error('Usage: node scripts/verify-site.mjs <lead-id>');
  process.exit(1);
}

const CLIENT_DIR = join(ROOT, 'packages/site-generator/clients', LEAD_ID);
const INDEX = join(CLIENT_DIR, 'index.html');

let errors = 0;
let warnings = 0;

function fail(msg) {
  console.error(`  FAIL  ${msg}`);
  errors++;
}

function warn(msg) {
  console.warn(`  WARN  ${msg}`);
  warnings++;
}

function check(condition, msg) {
  if (!condition) fail(msg);
}

console.log(`\nVerifying site: ${LEAD_ID}\n`);

if (!existsSync(INDEX)) {
  fail(`index.html not found at ${INDEX}`);
  process.exit(1);
}

const html = readFileSync(INDEX, 'utf-8');

// 1. Unrendered placeholder leaks
const placeholders = html.match(/\{\{[A-Z_]+\}\}/g);
if (placeholders) {
  fail(`Unrendered placeholders found: ${[...new Set(placeholders)].join(', ')}`);
} else {
  console.log('  PASS  No unrendered placeholders');
}

// 2. Handlebars remnants
if (html.includes('{{#if') || html.includes('{{/if') || html.includes('{{else')) {
  fail('Handlebars conditional remnants found ({{#if}}, {{/if}}, {{else}})');
} else {
  console.log('  PASS  No handlebars remnants');
}

// 3. WhatsApp link presence
const waMatch = html.match(/href="https:\/\/wa\.me\/(\d+)\?text=/);
if (waMatch) {
  console.log(`  PASS  WhatsApp link found (${waMatch[1]})`);
} else {
  fail('No WhatsApp link found');
}

// 4. Contact form service dropdown
const selectMatch = html.match(/<select[^>]*id="cf-service"[^>]*>([\s\S]*?)<\/select>/i);
if (selectMatch) {
  const options = selectMatch[1].match(/<option/g);
    if (options && options.length >= 2) {
      console.log(`  PASS  Service dropdown has ${options.length} options`);
    } else {
      fail(`Service dropdown has ${options.length} options (need 2+)`);
  }
} else {
  fail('No <select id="cf-service"> found');
}

// 5. Required section IDs
const requiredSections = ['hero', 'services', 'gallery', 'testimonials', 'contact', 'faq'];
const missingSections = requiredSections.filter(id => !html.includes(`id="${id}"`));
if (missingSections.length === 0) {
  console.log(`  PASS  All required section IDs present`);
} else {
  fail(`Missing section IDs: ${missingSections.join(', ')}`);
}

// 6. data-bm/data-en coverage
const bmCount = (html.match(/data-bm=/g) || []).length;
const enCount = (html.match(/data-en=/g) || []).length;
if (bmCount === enCount && bmCount > 10) {
  console.log(`  PASS  ${bmCount} data-bm + ${enCount} data-en attributes`);
} else {
  warn(`data-bm(${bmCount}) and data-en(${enCount}) counts differ or too few`);
}

// 7. Image files referenced exist
const imgRefs = [...html.matchAll(/src="images\/([^"]+)"/g)];
let imgMissing = 0;
imgRefs.forEach(([_, imgPath]) => {
  const fullPath = join(CLIENT_DIR, 'images', imgPath);
  if (!existsSync(fullPath)) {
    warn(`Image not found: ${imgPath}`);
    imgMissing++;
  }
});
if (imgMissing === 0) {
  console.log(`  PASS  All ${imgRefs.length} referenced images exist`);
} else {
  console.log(`  FAIL  ${imgMissing}/${imgRefs.length} images missing (listed as warnings above)`);
}

// 8. lang toggle script
if (html.includes('setLang')) {
  console.log('  PASS  Language toggle script present');
} else {
  fail('Language toggle script (setLang) not found');
}

// 9. footer present
if (html.includes('<footer')) {
  console.log('  PASS  Footer section present');
} else {
  fail('No <footer> found');
}

// 10. Social icons always in footer
const footerSvgs = (html.match(/<footer[\s\S]*?<\/footer>/g) || []).join('');
const socialSvgCount = (footerSvgs.match(/<svg/g) || []).length;
if (socialSvgCount >= 3) {
  console.log(`  PASS  ${socialSvgCount} social icons in footer`);
} else {
  fail(`Expected >=3 social SVGs in footer, got ${socialSvgCount}`);
}

// 11. "Lain-lain" option in service dropdown + custom text input
if (html.includes('__other__') || html.includes('Lain-lain')) {
  console.log('  PASS  "Lain-lain" option in service dropdown');
} else {
  fail('No "Lain-lain" / __other__ option in service dropdown');
}
if (html.includes('cf-service-other')) {
  console.log('  PASS  Custom service input (cf-service-other) present');
} else {
  fail('No cf-service-other custom input found');
}

// 12. FAQ buttons do NOT have data-bm directly (should be on inner span)
const faqButtons = html.match(/<button[^>]*onclick="toggleFaq\([^)]*\)"[^>]*>/g) || [];
let faqDataBmOnButton = 0;
faqButtons.forEach(b => { if (b.includes('data-bm=')) faqDataBmOnButton++; });
if (faqDataBmOnButton === 0 && faqButtons.length > 0) {
  console.log(`  PASS  FAQ ${faqButtons.length} buttons clean (data-bm on inner span)`);
} else if (faqButtons.length === 0) {
  warn('No FAQ buttons found to check');
} else {
  fail(`${faqDataBmOnButton}/${faqButtons.length} FAQ buttons have data-bm directly (should be on inner span)`);
}

// 13. Dual-language data checks (only if config has EN fields)
const cfgPath = join(CLIENT_DIR, 'config.json');
if (existsSync(cfgPath)) {
  const cfg = JSON.parse(readFileSync(cfgPath, 'utf-8'));
  let langOk = true;
  if (cfg.tagline_en) {
    const inHtml = html.includes(cfg.tagline_en);
    if (inHtml) console.log('  PASS  tagline_en found in HTML');
    else { fail('tagline_en not found in HTML'); langOk = false; }
  } else warn('No tagline_en in config — skipping');
  if (cfg.services_en) {
    const matchCount = cfg.services_en.filter(s => html.includes(s)).length;
    if (matchCount === cfg.services_en.length) console.log(`  PASS  services_en (${matchCount}/${cfg.services_en.length}) found`);
    else { fail(`services_en: ${matchCount}/${cfg.services_en.length} found`); langOk = false; }
  } else warn('No services_en in config — skipping');
  if (cfg.testimonials_en) {
    const allEnInHtml = cfg.testimonials_en.every(t => html.includes(t.text));
    if (allEnInHtml) console.log(`  PASS  testimonials_en texts found`);
    else { fail('Some testimonials_en texts missing from HTML'); langOk = false; }
  } else warn('No testimonials_en in config — skipping');
}

// Summary
console.log(`\n════════════════════════════════`);
console.log(`  ${errors} errors, ${warnings} warnings`);
console.log(`════════════════════════════════\n`);

if (errors > 0) process.exit(1);
