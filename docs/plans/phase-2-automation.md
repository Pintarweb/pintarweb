# Phase 2: Automation - Detailed Implementation Plan

## Overview

Phase 2 builds the automation layer that makes Pintarweb scalable. By the end of this phase, you can generate demo sites in < 30 minutes, process leads automatically, and track outreach systematically.

**Duration:** Week 2 (10-15 hours)  
**Cost:** RM 0  
**Success Criteria:** Can generate 20 leads and 5 demo sites in < 2 hours total

---

## 2.1 Site Generation Script

### Current State
- Manual process: Open OpenCode → load config → generate sections → assemble HTML
- Time per site: 2-3 hours
- Inconsistent output quality

### Target State
- Automated: `node generate-site.js --client=client-id`
- Time per site: < 30 minutes
- Consistent output quality

### Step-by-Step Implementation

#### Step 1: Analyze Existing Templates
1. Review existing client sites:
   ```bash
   ls packages/site-generator/clients/
   ```
2. Identify common sections:
   - Navigation
   - Hero
   - Services
   - Testimonials
   - Gallery
   - Contact/CTA
   - Footer
3. Note variations by niche (aircond vs plumbing vs renovation)

**Time:** 1 hour

#### Step 2: Create Template System
Create a template structure:
```
packages/site-generator/
├── templates/
│   ├── base/
│   │   ├── navigation.html
│   │   ├── hero.html
│   │   ├── services.html
│   │   ├── testimonials.html
│   │   ├── gallery.html
│   │   ├── contact.html
│   │   └── footer.html
│   ├── aircond/
│   │   └── hero.html (specialized)
│   ├── plumbing/
│   │   └── hero.html (specialized)
│   └── renovation/
│       └── hero.html (specialized)
├── scripts/
│   ├── generate-site.js
│   ├── generate-audit.js
│   ├── generate-report.js
│   └── utils/
│       ├── template-loader.js
│       ├── image-optimizer.js
│       └── config-validator.js
```

**Time:** 2 hours

#### Step 3: Build Template Loader
Create `scripts/utils/template-loader.js`:
```javascript
const fs = require('fs');
const path = require('path');

function loadTemplate(section, niche = 'base') {
  const basePath = path.join(__dirname, '..', '..', 'templates');
  
  // Try niche-specific template first
  const nichePath = path.join(basePath, niche, `${section}.html`);
  if (fs.existsSync(nichePath)) {
    return fs.readFileSync(nichePath, 'utf8');
  }
  
  // Fall back to base template
  const basePath2 = path.join(basePath, 'base', `${section}.html`);
  if (fs.existsSync(basePath2)) {
    return fs.readFileSync(basePath2, 'utf8');
  }
  
  throw new Error(`Template not found: ${section} for niche ${niche}`);
}

function renderTemplate(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || '';
  });
}

module.exports = { loadTemplate, renderTemplate };
```

**Time:** 1 hour

#### Step 4: Build Config Validator
Create `scripts/utils/config-validator.js`:
```javascript
function validateConfig(config) {
  const required = ['id', 'business_name', 'phone', 'area', 'niche'];
  const missing = required.filter(key => !config[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  
  // Validate phone format (Malaysian)
  const phoneClean = config.phone.replace(/\D/g, '');
  if (!phoneClean.startsWith('60') || phoneClean.length !== 11) {
    console.warn('Warning: Phone number may not be in Malaysian format');
  }
  
  return true;
}

module.exports = { validateConfig };
```

**Time:** 30 minutes

#### Step 5: Build Image Optimizer
Create `scripts/utils/image-optimizer.js`:
```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImage(inputPath, outputPath, options = {}) {
  const { width = 1200, quality = 80, format = 'webp' } = options;
  
  await sharp(inputPath)
    .resize(width)
    .toFormat(format, { quality })
    .toFile(outputPath);
}

async function processClientImages(clientId) {
  const clientDir = path.join(__dirname, '..', '..', 'clients', clientId, 'images');
  
  if (!fs.existsSync(clientDir)) {
    console.log('No images directory for client:', clientId);
    return;
  }
  
  const files = fs.readdirSync(clientDir);
  
  for (const file of files) {
    const inputPath = path.join(clientDir, file);
    const ext = path.extname(file);
    
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      const outputPath = inputPath.replace(ext, '.webp');
      await optimizeImage(inputPath, outputPath);
      console.log(`Optimized: ${file} → ${path.basename(outputPath)}`);
    }
  }
}

module.exports = { optimizeImage, processClientImages };
```

**Time:** 1 hour

#### Step 6: Build Main Site Generator
Create `scripts/generate-site.js`:
```javascript
const fs = require('fs');
const path = require('path');
const { loadTemplate, renderTemplate } = require('./utils/template-loader');
const { validateConfig } = require('./utils/config-validator');
const { processClientImages } = require('./utils/image-optimizer');

async function generateSite(clientId) {
  console.log(`Generating site for: ${clientId}`);
  
  // Load config
  const configPath = path.join(__dirname, '..', 'clients', clientId, 'config.json');
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config not found: ${configPath}`);
  }
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  validateConfig(config);
  
  // Process images
  await processClientImages(clientId);
  
  // Load templates
  const sections = [
    'navigation',
    'hero',
    'services',
    'testimonials',
    'gallery',
    'contact',
    'footer'
  ];
  
  const html = sections.map(section => {
    const template = loadTemplate(section, config.niche);
    return renderTemplate(template, config);
  }).join('\n');
  
  // Wrap in full HTML structure
  const fullHtml = `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.business_name} - ${config.area}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script defer src="https://analytics.pintarweb.com/script.js" data-website-id="YOUR_ID"></script>
</head>
<body>
${html}
</body>
</html>`;
  
  // Write output
  const outputPath = path.join(__dirname, '..', 'clients', clientId, 'index.html');
  fs.writeFileSync(outputPath, fullHtml);
  
  console.log(`Site generated: ${outputPath}`);
  return outputPath;
}

// CLI interface
const clientId = process.argv[2];
if (!clientId) {
  console.error('Usage: node generate-site.js <client-id>');
  process.exit(1);
}

generateSite(clientId).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
```

**Time:** 2 hours

#### Step 7: Build Audit Generator
Create `scripts/generate-audit.js`:
```javascript
const fs = require('fs');
const path = require('path');
const { loadTemplate, renderTemplate } = require('./utils/template-loader');

function generateAudit(clientId) {
  console.log(`Generating audit for: ${clientId}`);
  
  // Load config
  const configPath = path.join(__dirname, '..', 'clients', clientId, 'config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  // Calculate audit scores
  const audit = calculateAuditScores(config);
  
  // Load audit template
  const template = loadTemplate('audit', config.niche);
  const html = renderTemplate(template, { ...config, ...audit });
  
  // Write output
  const outputPath = path.join(__dirname, '..', 'clients', clientId, 'audit.html');
  fs.writeFileSync(outputPath, html);
  
  console.log(`Audit generated: ${outputPath}`);
  return outputPath;
}

function calculateAuditScores(config) {
  const scores = {
    visibility_score: 0,
    trust_score: 0,
    first_impression_score: null,
    competitor_gap: 0
  };
  
  // Visibility score (0-100)
  if (!config.audit.has_website) scores.visibility_score += 50;
  if (config.audit.google_maps_url) scores.visibility_score += 20;
  if (config.social.instagram_active) scores.visibility_score += 15;
  if (config.google_rating > 4.0) scores.visibility_score += 15;
  
  // Trust score (0-100)
  if (config.google_review_count > 10) scores.trust_score += 30;
  if (config.google_rating > 4.0) scores.trust_score += 30;
  if (config.social.instagram_active) scores.trust_score += 20;
  if (config.audit.has_website) scores.trust_score += 20;
  
  // First impression (only if has website)
  if (config.audit.has_website) {
    scores.first_impression_score = 60; // Placeholder
  }
  
  // Competitor gap
  scores.competitor_gap = -25; // Placeholder
  
  return scores;
}

// CLI interface
const clientId = process.argv[2];
if (!clientId) {
  console.error('Usage: node generate-audit.js <client-id>');
  process.exit(1);
}

generateAudit(clientId);
```

**Time:** 1.5 hours

#### Step 8: Build Report Generator
Create `scripts/generate-report.js`:
```javascript
const fs = require('fs');
const path = require('path');

function generateReport(clientId) {
  console.log(`Generating report for: ${clientId}`);
  
  const clientDir = path.join(__dirname, '..', 'clients', clientId);
  
  // Read audit and site HTML
  const auditHtml = fs.readFileSync(path.join(clientDir, 'audit.html'), 'utf8');
  const siteHtml = fs.readFileSync(path.join(clientDir, 'index.html'), 'utf8');
  
  // Combine into report
  const reportHtml = `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Laporan Online Presence - ${clientId}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
  <div class="max-w-4xl mx-auto p-8">
    <h1 class="text-3xl font-bold mb-8">Laporan Online Presence</h1>
    
    <section class="mb-12">
      <h2 class="text-2xl font-bold mb-4">Audit Online Presence</h2>
      ${auditHtml}
    </section>
    
    <section class="mb-12">
      <h2 class="text-2xl font-bold mb-4">Demo Website</h2>
      <iframe src="index.html" class="w-full h-[600px] border-2 border-gray-300"></iframe>
    </section>
    
    <section class="text-center">
      <a href="https://wa.me/60123456789" class="inline-block bg-green-500 text-white px-8 py-4 rounded-lg font-bold">
        Hubungi Kami untuk Demo Penuh
      </a>
    </section>
  </div>
</body>
</html>`;
  
  // Write output
  const outputPath = path.join(clientDir, 'report.html');
  fs.writeFileSync(outputPath, reportHtml);
  
  console.log(`Report generated: ${outputPath}`);
  return outputPath;
}

// CLI interface
const clientId = process.argv[2];
if (!clientId) {
  console.error('Usage: node generate-report.js <client-id>');
  process.exit(1);
}

generateReport(clientId);
```

**Time:** 1 hour

#### Step 9: Create Master Generator Script
Create `scripts/generate-all.js`:
```javascript
const { execSync } = require('child_process');

function generateAll(clientId) {
  console.log(`Generating all outputs for: ${clientId}`);
  
  try {
    execSync(`node scripts/generate-site.js ${clientId}`, { stdio: 'inherit' });
    execSync(`node scripts/generate-audit.js ${clientId}`, { stdio: 'inherit' });
    execSync(`node scripts/generate-report.js ${clientId}`, { stdio: 'inherit' });
    
    console.log(`\n✅ All outputs generated for: ${clientId}`);
    console.log(`- Site: clients/${clientId}/index.html`);
    console.log(`- Audit: clients/${clientId}/audit.html`);
    console.log(`- Report: clients/${clientId}/report.html`);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

const clientId = process.argv[2];
if (!clientId) {
  console.error('Usage: node generate-all.js <client-id>');
  process.exit(1);
}

generateAll(clientId);
```

**Time:** 30 minutes

#### Step 10: Test with Existing Client
1. Run generator for test-razif:
   ```bash
   cd packages/site-generator
   node scripts/generate-all.js test-razif
   ```
2. Verify all files generated
3. Open in browser and check quality
4. Fix any issues

**Time:** 1 hour

### Checklist
- [ ] Template system created (base + niche-specific)
- [ ] Template loader built
- [ ] Config validator built
- [ ] Image optimizer built
- [ ] Site generator script built
- [ ] Audit generator script built
- [ ] Report generator script built
- [ ] Master generator script built
- [ ] Tested with existing client (test-razif)
- [ ] Generation time < 30 minutes per site

### Resources
- Sharp (image processing): https://sharp.pixelplumbing.com/
- Node.js fs module: https://nodejs.org/api/fs.html

---

## 2.2 Lead Pipeline

### Current State
- Scraper outputs raw leads to JSON
- Manual filtering and selection
- No prioritization

### Target State
- Automated lead scoring
- Smart filtering criteria
- Export to outreach list format

### Step-by-Step Implementation

#### Step 1: Define Lead Scoring Criteria
Create scoring algorithm:
```javascript
function scoreLead(lead) {
  let score = 0;
  
  // No website = high priority
  if (!lead.has_website) score += 30;
  
  // Low rating = opportunity
  if (lead.google_rating < 4.0) score += 20;
  
  // Few reviews = opportunity
  if (lead.review_count < 20) score += 15;
  
  // Active on social but no website = frustrated
  if (lead.instagram_active && !lead.has_website) score += 25;
  
  // High search volume area = valuable
  if (lead.search_volume > 200) score += 10;
  
  return score;
}
```

**Time:** 30 minutes

#### Step 2: Build Lead Processor
Create `scripts/process-leads.js`:
```javascript
const fs = require('fs');
const path = require('path');

function processLeads(inputFile, outputFile) {
  console.log(`Processing leads from: ${inputFile}`);
  
  // Read raw leads
  const rawLeads = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  
  // Score and filter
  const processedLeads = rawLeads
    .map(lead => ({
      ...lead,
      score: scoreLead(lead),
      priority: getPriority(scoreLead(lead))
    }))
    .filter(lead => lead.score >= 50) // Only high-priority leads
    .sort((a, b) => b.score - a.score);
  
  // Write output
  fs.writeFileSync(outputFile, JSON.stringify(processedLeads, null, 2));
  
  console.log(`Processed ${rawLeads.length} leads → ${processedLeads.length} high-priority`);
  console.log(`Output: ${outputFile}`);
}

function scoreLead(lead) {
  let score = 0;
  if (!lead.has_website) score += 30;
  if (lead.google_rating < 4.0) score += 20;
  if (lead.review_count < 20) score += 15;
  if (lead.instagram_active && !lead.has_website) score += 25;
  if (lead.search_volume > 200) score += 10;
  return score;
}

function getPriority(score) {
  if (score >= 80) return 'HIGH';
  if (score >= 60) return 'MEDIUM';
  return 'LOW';
}

const inputFile = process.argv[2];
const outputFile = process.argv[3] || 'leads-processed.json';

if (!inputFile) {
  console.error('Usage: node process-leads.js <input-file> [output-file]');
  process.exit(1);
}

processLeads(inputFile, outputFile);
```

**Time:** 1 hour

#### Step 3: Build Outreach List Exporter
Create `scripts/export-outreach-list.js`:
```javascript
const fs = require('fs');

function exportOutreachList(leadsFile, outputFile) {
  const leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8'));
  
  const outreachList = leads.map(lead => ({
    business_name: lead.business_name,
    contact_name: lead.contact_name || 'Owner',
    phone: lead.phone,
    whatsapp: `https://wa.me/${lead.phone.replace(/\D/g, '')}`,
    area: lead.area,
    has_website: lead.has_website,
    google_rating: lead.google_rating,
    review_count: lead.review_count,
    score: lead.score,
    priority: lead.priority,
    notes: generateNotes(lead)
  }));
  
  // Export as CSV for easy viewing
  const csv = [
    ['Business Name', 'Contact', 'Phone', 'WhatsApp', 'Area', 'Has Website', 'Rating', 'Reviews', 'Score', 'Priority', 'Notes'].join(','),
    ...outreachList.map(lead => [
      lead.business_name,
      lead.contact_name,
      lead.phone,
      lead.whatsapp,
      lead.area,
      lead.has_website,
      lead.google_rating,
      lead.review_count,
      lead.score,
      lead.priority,
      lead.notes
    ].map(field => `"${field}"`).join(','))
  ].join('\n');
  
  fs.writeFileSync(outputFile, csv);
  console.log(`Exported ${outreachList.length} leads to: ${outputFile}`);
}

function generateNotes(lead) {
  const notes = [];
  if (!lead.has_website) notes.push('No website');
  if (lead.instagram_active) notes.push('Active on IG');
  if (lead.google_rating < 4.0) notes.push(`Low rating: ${lead.google_rating}`);
  return notes.join('; ');
}

const leadsFile = process.argv[2];
const outputFile = process.argv[3] || 'outreach-list.csv';

if (!leadsFile) {
  console.error('Usage: node export-outreach-list.js <leads-file> [output-file]');
  process.exit(1);
}

exportOutreachList(leadsFile, outputFile);
```

**Time:** 1 hour

#### Step 4: Test with Existing Leads
1. Process existing leads:
   ```bash
   cd data/leads
   node ../../packages/site-generator/scripts/process-leads.js leads-cheras.json leads-processed.json
   ```
2. Export outreach list:
   ```bash
   node ../../packages/site-generator/scripts/export-outreach-list.js leads-processed.json outreach-list.csv
   ```
3. Open CSV in spreadsheet and verify quality
4. Adjust scoring if needed

**Time:** 1 hour

### Checklist
- [ ] Lead scoring criteria defined
- [ ] Lead processor script built
- [ ] Outreach list exporter built
- [ ] Tested with existing leads
- [ ] Can process 100 leads in < 1 minute
- [ ] Output quality verified

---

## 2.3 Outreach Tracking

### Current State
- No tracking system
- Manual follow-up reminders
- No open/click tracking

### Target State
- Database tracking for all outreach events
- Open/click tracking on report URLs
- Automated follow-up reminders

### Step-by-Step Implementation

#### Step 1: Set Up Outreach Database
Create `scripts/setup-outreach-db.js`:
```javascript
const { Database } = require('bun:sqlite');

function setupOutreachDB() {
  const db = new Database('outreach.db');
  
  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      business_name TEXT,
      phone TEXT,
      area TEXT,
      score INTEGER,
      priority TEXT,
      status TEXT DEFAULT 'new',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS outreach_events (
      id TEXT PRIMARY KEY,
      lead_id TEXT,
      event_type TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      FOREIGN KEY (lead_id) REFERENCES leads(id)
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS report_views (
      id TEXT PRIMARY KEY,
      lead_id TEXT,
      ip_address TEXT,
      user_agent TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lead_id) REFERENCES leads(id)
    )
  `);
  
  console.log('✅ Outreach database created: outreach.db');
}

setupOutreachDB();
```

**Time:** 30 minutes

#### Step 2: Build Outreach Tracker
Create `scripts/track-outreach.js`:
```javascript
const { Database } = require('bun:sqlite');
const { v4: uuidv4 } = require('uuid');

function trackEvent(leadId, eventType, notes = '') {
  const db = new Database('outreach.db');
  
  const eventId = uuidv4();
  db.run(
    'INSERT INTO outreach_events (id, lead_id, event_type, notes) VALUES (?, ?, ?, ?)',
    [eventId, leadId, eventType, notes]
  );
  
  // Update lead status
  if (eventType === 'first_outreach') {
    db.run('UPDATE leads SET status = ? WHERE id = ?', ['contacted', leadId]);
  } else if (eventType === 'follow_up') {
    db.run('UPDATE leads SET status = ? WHERE id = ?', ['follow_up', leadId]);
  } else if (eventType === 'demo_sent') {
    db.run('UPDATE leads SET status = ? WHERE id = ?', ['demo_sent', leadId]);
  }
  
  console.log(`✅ Tracked: ${eventType} for lead ${leadId}`);
}

const [leadId, eventType, notes] = process.argv.slice(2);

if (!leadId || !eventType) {
  console.error('Usage: node track-outreach.js <lead-id> <event-type> [notes]');
  console.error('Event types: first_outreach, follow_up, demo_sent, report_view, reply, closed');
  process.exit(1);
}

trackEvent(leadId, eventType, notes || '');
```

**Time:** 1 hour

#### Step 3: Build Report View Tracker
Create Cloudflare Worker endpoint for tracking report views:
```javascript
// packages/site-generator/src/worker.js (update existing worker)

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Track report views
    if (url.pathname.includes('/report') && request.method === 'GET') {
      const leadId = url.pathname.split('/')[2];
      const ipAddress = request.headers.get('CF-Connecting-IP');
      const userAgent = request.headers.get('User-Agent');
      
      // Track view in D1
      await env.DB.prepare(
        'INSERT INTO report_views (id, lead_id, ip_address, user_agent) VALUES (?, ?, ?, ?)'
      ).bind(
        crypto.randomUUID(),
        leadId,
        ipAddress,
        userAgent
      ).run();
      
      console.log(`📊 Report view tracked: ${leadId}`);
    }
    
    // Continue with normal routing
    return handleRequest(request, env);
  }
};
```

**Time:** 1 hour

#### Step 4: Build Dashboard for Outreach Tracking
Create simple dashboard to view outreach status:
```javascript
// scripts/view-outreach-dashboard.js
const { Database } = require('bun:sqlite');

function viewDashboard() {
  const db = new Database('outreach.db');
  
  const stats = db.query(`
    SELECT 
      status,
      COUNT(*) as count
    FROM leads
    GROUP BY status
  `).all();
  
  const recentEvents = db.query(`
    SELECT 
      l.business_name,
      o.event_type,
      o.timestamp,
      o.notes
    FROM outreach_events o
    JOIN leads l ON o.lead_id = l.id
    ORDER BY o.timestamp DESC
    LIMIT 10
  `).all();
  
  console.log('\n📊 Outreach Dashboard\n');
  console.log('Status Breakdown:');
  stats.forEach(stat => {
    console.log(`  ${stat.status}: ${stat.count}`);
  });
  
  console.log('\nRecent Events:');
  recentEvents.forEach(event => {
    console.log(`  ${event.timestamp} - ${event.business_name}: ${event.event_type}`);
  });
}

viewDashboard();
```

**Time:** 1 hour

### Checklist
- [ ] Outreach database created
- [ ] Outreach tracker script built
- [ ] Report view tracking integrated
- [ ] Dashboard script built
- [ ] Tested with sample data
- [ ] Can track all outreach events

---

## 2.4 WhatsApp Integration (Manual for Phase 1)

### Current State
- Manual WhatsApp messaging
- No templates
- No tracking

### Target State
- Message templates ready
- Tracking system in place
- Consistent messaging

### Step-by-Step Implementation

#### Step 1: Create Message Templates
Create `docs/whatsapp-templates.md`:
```markdown
# WhatsApp Message Templates

## Touch 1 - First Outreach (Day 0)

### Standard (no website)
Hi [Name], saya sempat check — every bulan roughly 290 orang search aircond service kat area [Area]. Tapi [Business Name] tak nampak langsung dalam result.

Saya dah sediakan report + demo untuk tunjuk macam mana customer boleh jumpa awak: [report URL]

Ada apa-apa boleh tanya sini.

### Social-aware (Instagram active)
Hi [Name], nampak [Business Name] ada IG aktif — project photos bagus. Tapi masa saya check, customer yang search Google kat area [Area] tak nampak bisnes awak langsung.

Saya ada report pasal customer yang missed tu: [report URL]

Boleh tengok bila free.

## Touch 2 - Follow Up (Day 3)

Just nak check — awak dah tengok report tu? 290 orang search aircond service [area] sebulan. Bayangkan kalau 5% dari tu jadi customer awak — 15 customer baru sebulan.

## Touch 3 - Price Discussion

Kalau berminat, ada 2 pilihan:
1. RM 800 one-time untuk website
2. RM 149/bulan — website FREE, auto-reply + GMB + SEO included. 3 bulan advance (RM 447)

Satu job chemical wash (RM 180-350) dah cover sebulan.
```

**Time:** 30 minutes

#### Step 2: Set Up WhatsApp Business (Optional)
1. Download WhatsApp Business app
2. Register with business number
3. Set up business profile:
   - Business name: Pintarweb
   - Category: Internet Company
   - Description: Website-as-a-Service for Malaysian SMEs
4. Set up quick replies for common questions

**Time:** 30 minutes

#### Step 3: Test Outreach
1. Select 5 test contacts (friends or family with businesses)
2. Send Touch 1 message
3. Track responses
4. Refine templates based on feedback

**Time:** 1 hour

### Checklist
- [ ] Message templates created
- [ ] WhatsApp Business app set up (optional)
- [ ] Tested with 5 contacts
- [ ] Templates refined based on feedback

---

## Phase 2 Completion Checklist

### Site Generation
- [ ] Template system created
- [ ] Site generator script built and tested
- [ ] Audit generator script built and tested
- [ ] Report generator script built and tested
- [ ] Can generate complete site in < 30 minutes

### Lead Pipeline
- [ ] Lead scoring algorithm defined
- [ ] Lead processor script built
- [ ] Outreach list exporter built
- [ ] Can process 100 leads in < 1 minute

### Outreach Tracking
- [ ] Database set up
- [ ] Event tracking working
- [ ] Report view tracking integrated
- [ ] Dashboard accessible

### WhatsApp Integration
- [ ] Message templates created
- [ ] Tested with 5 contacts
- [ ] Templates refined

### Final Verification
- [ ] Can generate 20 leads in < 1 hour
- [ ] Can generate 5 demo sites in < 2 hours
- [ ] Can track all outreach events
- [ ] Full pipeline tested end-to-end

---

## Next Steps

After completing Phase 2, proceed to **Phase 3: Pilot** where you'll:
- Run 2-3 free pilots with real prospects
- Refine process based on feedback
- Document SOP for scaling

**Estimated time to complete Phase 2:** 10-15 hours  
**Estimated cost:** RM 0

---

**Last Updated:** 2026-06-23  
**Status:** Ready to execute
