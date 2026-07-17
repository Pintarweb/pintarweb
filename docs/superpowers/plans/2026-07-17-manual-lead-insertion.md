# Manual Lead Insertion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a modal form in the Pipeline tab to manually insert leads into the pipeline.

**Architecture:** Add button + modal to `PipelineView.html`, JS functions to `dashboard.js.txt`, and a dedicated endpoint `POST /api/leads/manual` in `worker.ts`. Manual leads bypass the upsert score filter and background audits.

**Tech Stack:** Cloudflare Workers (TypeScript), vanilla JS, Tailwind CSS (CDN), D1 SQLite

## Global Constraints

- Phone normalization via `normalizePhone` (existing utility)
- Source origin for manual leads = "Manual"
- lead_score = 1 for all manual leads
- pipeline_stage = "new" for all manual leads
- No background audits (technical audit / AI qualification) for manual leads
- Malaysian BM UI copy where applicable (but this is internal tool, English is fine)

---

### Task 1: Add "Add Lead" button + modal markup to PipelineView.html

**Files:**
- Modify: `src/ui/components/PipelineView.html`

**Interfaces:**
- Consumes: nothing from prior tasks
- Produces: modal HTML with form fields referenced by `id` in JS

- [ ] **Step 1: Read current file**

Read `packages/scraper/src/ui/components/PipelineView.html` to understand existing structure.

- [ ] **Step 2: Add "+ Add Lead" button next to "Export to CRM" button**

In the header div (line 2-12), add a button before the Export to CRM button:

```html
<button onclick="openAddLeadModal()" class="px-5 py-2 rounded-lg text-xs font-black transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-sm uppercase tracking-widest flex items-center gap-2">
    + Add Lead
</button>
```

- [ ] **Step 3: Add modal markup before the leads container**

Add this modal after the `<!-- Config Preview Modal -->` closing `</div>` and before `<!-- Leads Results List -->`:

```html
<!-- Add Lead Modal -->
<div id="add-lead-panel" class="hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div class="p-8">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-black text-slate-900 uppercase tracking-tight">Add New Lead</h3>
                <button onclick="closeAddLeadModal()" class="text-slate-400 hover:text-slate-600 text-2xl font-black">×</button>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Business Name *</label>
                    <input type="text" id="add-lead-name" required
                        class="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-[13px] font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                </div>
                <div>
                    <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone *</label>
                    <input type="tel" id="add-lead-phone" required placeholder="+60 or 01x-xxxxxxx"
                        class="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-[13px] font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                </div>
                <div>
                    <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Category *</label>
                    <select id="add-lead-category" required
                        class="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-[13px] font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                        <option value="">Select category...</option>
                    </select>
                </div>
                <div>
                    <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Website URL</label>
                    <input type="url" id="add-lead-website" placeholder="https://..."
                        class="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-[13px] font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                </div>
                <div>
                    <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Address</label>
                    <input type="text" id="add-lead-address"
                        class="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-[13px] font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                </div>
                <div class="flex gap-3 pt-2">
                    <button onclick="closeAddLeadModal()"
                        class="flex-1 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
                    <button onclick="submitManualLead()"
                        class="flex-1 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest shadow-md shadow-blue-200 transition-all">Add Lead</button>
                </div>
            </div>
        </div>
    </div>
</div>
```

### Task 2: Add JS functions for manual lead insertion

**Files:**
- Modify: `src/ui/js/dashboard.js.txt`

**Interfaces:**
- Consumes: modal HTML with ids `add-lead-panel`, `add-lead-name`, `add-lead-phone`, `add-lead-category`, `add-lead-website`, `add-lead-address`
- Produces: POST to `/api/leads/manual`

- [ ] **Step 1: Read current file**

Read `packages/scraper/src/ui/js/dashboard.js.txt` to find the right insertion point (near existing modal functions).

- [ ] **Step 2: Add closeAddLeadModal function**

Add near the existing `closeIntakePanel` / `closeConfigPreview` functions:

```javascript
function closeAddLeadModal() {
    document.getElementById('add-lead-panel').classList.add('hidden');
}
```

- [ ] **Step 3: Add openAddLeadModal function**

```javascript
function openAddLeadModal() {
    // Populate category dropdown from existing leads
    const catSelect = document.getElementById('add-lead-category');
    const currentVal = catSelect.value;
    const cats = [...new Set(allLeads.filter(l => l.category && l.category !== 'null').map(l => l.category))].sort();
    catSelect.innerHTML = '<option value="">Select category...</option>' + cats.map(c => `<option value="${c}">${c}</option>`).join('');
    if (currentVal) catSelect.value = currentVal;

    // Clear form fields
    document.getElementById('add-lead-name').value = '';
    document.getElementById('add-lead-phone').value = '';
    document.getElementById('add-lead-website').value = '';
    document.getElementById('add-lead-address').value = '';

    document.getElementById('add-lead-panel').classList.remove('hidden');
}
```

- [ ] **Step 4: Add submitManualLead function**

```javascript
async function submitManualLead() {
    const name = document.getElementById('add-lead-name').value.trim();
    const phone = document.getElementById('add-lead-phone').value.trim();
    const category = document.getElementById('add-lead-category').value;
    const website = document.getElementById('add-lead-website').value.trim() || null;
    const address = document.getElementById('add-lead-address').value.trim() || null;

    if (!name || !phone || !category) {
        alert('Please fill in all required fields (Business Name, Phone, Category).');
        return;
    }

    // Strip non-digits for normalization, keep leading +
    const digitsOnly = phone.replace(/[^0-9+]/g, '');
    if (digitsOnly.length < 8) {
        alert('Please enter a valid phone number.');
        return;
    }

    try {
        const res = await fetch('/api/leads/manual', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                business_name: name,
                phone: digitsOnly,
                category,
                website_url: website,
                address
            })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to create lead');
        }
        closeAddLeadModal();
        fetchLeads();
    } catch (e) {
        alert('Error: ' + e.message);
    }
}
```

### Task 3: Add POST /api/leads/manual endpoint in worker.ts

**Files:**
- Modify: `src/api/worker.ts`

**Interfaces:**
- Consumes: POST body with `{ business_name, phone, category, website_url?, address? }`
- Produces: D1 INSERT, returns `{ success, id, phone_normalized }`

- [ ] **Step 1: Read worker.ts around the API routing section**

Read `packages/scraper/src/api/worker.ts` to find the routing pattern (around line 26-89 for POST /api/leads).

- [ ] **Step 2: Add imports at top of worker.ts**

Add these to the existing import block:

```typescript
import { v4 as uuidv4 } from "uuid";
import { normalizePhone } from "../utils/normalizePhone.js";
```

- [ ] **Step 3: Add the manual lead endpoint handler**

Add this handler after the existing `POST /api/leads` block (after line 89's closing brace) and before the `PATCH /api/leads` block:

```typescript
// POST /api/leads/manual — Manual lead insertion (bypasses upsert score filter + background audits)
if (url.pathname === "/api/leads/manual" && request.method === "POST") {
    try {
        const body = await request.json() as any;

        if (!body.business_name || !body.phone || !body.category) {
            return new Response(JSON.stringify({ error: "business_name, phone, and category are required" }), { status: 400 });
        }

        const phoneNormalized = normalizePhone(body.phone);

        if (!phoneNormalized) {
            return new Response(JSON.stringify({ error: "Invalid phone number" }), { status: 400 });
        }

        // Check for duplicate
        const existing = await env.pintarweb_scraper_db.prepare(
            `SELECT phone_normalized FROM leads WHERE phone_normalized = ?`
        ).bind(phoneNormalized).first();

        if (existing) {
            return new Response(JSON.stringify({ error: "Lead with this phone number already exists" }), { status: 409 });
        }

        const id = uuidv4();
        const whatsappLink = `https://wa.me/${phoneNormalized}`;

        await env.pintarweb_scraper_db.prepare(`
            INSERT INTO leads (
                id, phone_normalized, business_name, source_origin, website_url,
                whatsapp_link, lead_score, address, category, status, pipeline_stage
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            id,
            phoneNormalized,
            body.business_name,
            "Manual",
            body.website_url || null,
            whatsappLink,
            1,
            body.address || null,
            body.category,
            "New",
            "new"
        ).run();

        return new Response(JSON.stringify({ success: true, id, phone_normalized: phoneNormalized }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
```

- [ ] **Step 4: Update source filter to include "Manual"**

In `PipelineView.html`, find the source filter `<select id="filter-source">` (line 79) and add a "Manual" option:

```html
<option value="Manual">Manual</option>
```
