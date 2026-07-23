# Demo Build — Image Fallback & Auto-Advance Pipeline

**Date:** 2026-07-23  
**Status:** Draft  
**Author:** OpenCode Agent

---

## 1. Goals

1. **Auto-advance** lead from `new` to `images_collected` when the intake form successfully uploads images (`images_collected > 0`)
2. **Stage validation** — reject manual advancement to `images_collected` if no images exist in D1
3. **Pre-build image fallback** — a script that runs before `build-client.sh` to copy niche-specific stock images for any missing files and generate an initials-based logo SVG
4. **Logo `<img>` slots** — update nav and footer templates in LLM site generation to reference `images/logo.*`

---

## 2. Changes

### 2.1 Server — Auto-Advance on Intake Submit

**File:** `packages/scraper/src/api/worker.ts` — `PATCH /api/leads/:phone/intake`

After the UPDATE query that saves intake data, if the incoming payload contains a truthy `images_collected` value AND the current `pipeline_stage` is `new` (or NULL), also set `pipeline_stage = 'images_collected'`.

Logic:
```typescript
if (body.images_collected && body.images_collected > 0) {
    const current = await db.prepare(
        `SELECT pipeline_stage FROM leads WHERE phone_normalized = ?`
    ).bind(phone).first() as any;
    if (!current || current.pipeline_stage === 'new' || current.pipeline_stage === null) {
        await db.prepare(
            `UPDATE leads SET pipeline_stage = 'images_collected', updated_at = CURRENT_TIMESTAMP WHERE phone_normalized = ?`
        ).bind(phone).run();
    }
}
```

### 2.2 Server — Stage Validation

**File:** `packages/scraper/src/api/worker.ts` — `PATCH /api/leads/:phone/stage`

When `pipeline_stage === 'images_collected'`, query the lead's `images_collected` column first. Return 400 if missing or zero:
```typescript
if (pipeline_stage === "images_collected") {
    const lead = await db.prepare(
        `SELECT images_collected FROM leads WHERE phone_normalized = ?`
    ).bind(phone).first() as any;
    if (!lead || !lead.images_collected || lead.images_collected < 1) {
        return new Response(JSON.stringify({
            error: "Lead must have at least 1 image uploaded before advancing to images_collected stage"
        }), { status: 400 });
    }
}
```

### 2.3 Pre-Build Script — `scripts/prepare-demo-images.sh`

**Purpose:** Ensure every slot in `clients/{leadId}/images/` has a real image before the LLM generates the HTML and `build-client.sh` compiles CSS. The LLM can then safely reference `images/hero.webp`, `images/logo.*`, `images/gallery-*.webp`, and `images/service-*.webp`.

**Usage:**
```bash
bash scripts/prepare-demo-images.sh <lead-id> <niche> [client-dir]
```

**Arguments:**
| Arg | Description |
|-----|-------------|
| `lead-id` | Lead UUID or slug (e.g., `a1b2c3d4` or `demo-kl-aircond-pro`) |
| `niche` | Niche from lead data (e.g., `aircond-contractor`, `plumbing`, `electrical`) |
| `client-dir` | Optional override for client dir (default: `packages/site-generator/clients/{lead-id}`) |

**Steps:**

1. **Resolve directories**
   - `CLIENT_DIR="${3:-packages/site-generator/clients/$1}"`
   - `IMAGES_DIR="$CLIENT_DIR/images"`
   - `STOCK_DIR="packages/site-generator/design-system/references/image-collections/{category}"`
   - Create `IMAGES_DIR` if not exists

2. **Map niche to stock category:**
   | Niche | Stock Dir |
   |-------|-----------|
   | `aircond-contractor` | `aircond-service` |
   | `plumbing` | `plumbing` |
   | `electrical` | `electrical` |
   | `renovation` | `renovation` |
   | `general` | (skip — no stock dir) |

3. **Download R2 images** (if R2 credentials available — graceful skip if not):
   - `logo.*` → `IMAGES_DIR/logo.{ext}`
   - `hero.*` → `IMAGES_DIR/hero.{ext}`
   - `gallery-*.*` → `IMAGES_DIR/gallery-*.{ext}`
   
   Uses `wrangler r2 get` or `curl` against public R2 URL with `pub-{ACCOUNT_ID}.r2.dev/pintarweb-client-images/{leadId}/`

   If R2 download unavailable (no creds, no public access), skip gracefully — stock fill still runs.

4. **Fill missing images from stock:**

   For each required image slot, if the file doesn't exist in `IMAGES_DIR`, copy from `STOCK_DIR`:
   - `hero.webp` → `images/hero.webp`
   - `service-1.webp` through `service-3.webp`
   - `gallery-1.webp` through `gallery-3.webp`

   If no stock dir exists for the niche, skip stock fill.

5. **Generate initials logo** if no `logo.*` exists in `IMAGES_DIR`:

   Creates `images/logo.svg` — an SVG with the business name's first letter(s) in a colored circle. Uses a default primary color (`#1B4332` — forest green) that matches the `trustworthy-local` mood.

   SVG template:
   ```svg
   <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
     <rect width="200" height="200" rx="40" fill="{PRIMARY_COLOR}"/>
     <text x="100" y="120" font-family="Plus Jakarta Sans, sans-serif"
           font-size="80" font-weight="700" fill="white"
           text-anchor="middle" dominant-baseline="middle">{INITIALS}</text>
   </svg>
   ```

   Initials: first letter of each word in business name, max 3 chars, uppercase. Falls back to `"PW"` if name is empty.

6. **Log** what was downloaded, filled, or generated — so the user knows which images are real vs fallback.

**Integrated into build pipeline:**

The `buildDemo()` function in the dashboard or the `fullCmd` should run `prepare-demo-images.sh` before `build-client.sh`:
```bash
bash scripts/prepare-demo-images.sh {leadId} {niche} && bash scripts/build-client.sh {leadId}
```

### 2.4 Logo Slots in Nav & Footer

**In AGENTS.md rules** (`packages/site-generator/AGENTS.md`):

Update the Image Pipeline section to include logo:
```
1. **PRIORITY 1 (Client Specific):** Check `clients/{id}/images/` first. Use relative paths (e.g., `images/hero.webp`, `images/service-1.webp`, `images/gallery-1.webp`).
2. **PRIORITY 2 (System Fallback):** If client images are missing, use `design-system/references/image-collections/{category}/`
3. **Logo:** Always reference `images/logo.{svg|webp|png}` in the nav and footer. If exists, show as `<img>`. If not, fall back to business name text.
4. **FORBIDDEN:** No external URLs, no gradient placeholders, no colored boxes with icons.
```

**Nav template rule** (for LLM generation):
```html
<!-- In nav: logo image alongside business name -->
<a href="#" class="flex items-center gap-2">
  <img src="images/logo.svg" alt="{Business Name}" class="h-8 w-auto" loading="lazy" />
  <span class="font-extrabold text-base ...">{Business Name}</span>
</a>
```

**Footer template rule**:
```html
<!-- In footer business info column -->
<div class="flex items-center gap-2 mb-2">
  <img src="images/logo.svg" alt="{Business Name}" class="h-8 w-auto" loading="lazy" />
  <p class="font-extrabold text-white text-base">{Business Name}</p>
</div>
```

### 2.5 Dashboard — Build Button Updates

**File:** `packages/scraper/src/ui/js/dashboard.js.txt`

The `fullCmd` in `buildDemo()` changes from:
```bash
cd ~/projects/pintarweb && bash scripts/build-client.sh ${leadId} && bash scripts/deploy-preview.sh
```
To:
```bash
cd ~/projects/pintarweb && bash scripts/prepare-demo-images.sh ${leadId} ${niche} && bash scripts/build-client.sh ${leadId} && bash scripts/deploy-preview.sh
```

The `buildDemo()` function should pass the selected niche (from `intake-niche` dropdown or `lead.niche`).

---

## 3. Implementation Order

| Step | File(s) | Description |
|------|---------|-------------|
| 1 | `packages/scraper/src/api/worker.ts` | Auto-advance on intake submit |
| 2 | `packages/scraper/src/api/worker.ts` | Stage validation for images_collected |
| 3 | `scripts/prepare-demo-images.sh` | Pre-build script (new file) |
| 4 | `packages/scraper/src/ui/js/dashboard.js.txt` | Update build command |
| 5 | `packages/site-generator/AGENTS.md` | Update logo rules |

---

## 4. Edge Cases & Notes

- **No R2 access during pre-build**: script degrades gracefully — still fills from stock and generates initials logo. R2-downloaded images are a best-effort bonus.
- **No stock dir for niche**: `aircond-install`, `aircond-repair` have no stock images. The script skips stock fill for these but still generates initials logo.
- **`images_collected` count includes ALL R2 objects** (logo, hero, gallery). A single logo upload counts as 1 image meeting the requirement.
- **Dashboard toast on stage rejection**: if the server returns 400, `advanceStage()` should show a toast with the error message.
