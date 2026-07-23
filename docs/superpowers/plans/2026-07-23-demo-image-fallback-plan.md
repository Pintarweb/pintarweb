# Demo Image Fallback & Auto-Advance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add auto-advance on intake submit, server-side stage validation, a pre-build image fallback script, build command updates, and logo rules for demo sites.

**Architecture:** Server-side validation in two PATCH endpoints (`/intake` for auto-advance, `/stage` for rejection), a new bash script for image preparation, and minor dashboard/AGENTS.md updates.

**Tech Stack:** TypeScript (Workers), Bash, R2 public URLs, SVG generation

## Global Constraints

- Malaysian BM for customer-facing text
- RM446 everywhere (not RM447)
- Scripts use bash (set -e)
- Worker uses TypeScript with `Bindings` type for env

---

### Task 1: Auto-Advance on Intake Submit

**Files:**
- Modify: `packages/scraper/src/api/worker.ts` (within PATCH /intake handler, after `images_collected` save)

**Interfaces:**
- Consumes: `PATCH /api/leads/:phone/intake` with `{ images_collected: number }`
- Produces: auto-advances `pipeline_stage` to `images_collected` in D1

- [ ] **Step 1: Add auto-advance logic**

After the `images_collected` UPDATE block (lines 187-191), add a check: if `images_collected > 0`, query the lead's current `pipeline_stage`, and if it's `new` or `null`, update it to `images_collected`:

```typescript
                if (images_collected !== undefined) {
                    await env.pintarweb_scraper_db.prepare(
                        `UPDATE leads SET images_collected = ?, updated_at = CURRENT_TIMESTAMP WHERE phone_normalized = ?`
                    ).bind(images_collected, phone).run();
                    // Auto-advance to images_collected stage if currently new
                    if (images_collected > 0) {
                        const cur = await env.pintarweb_scraper_db.prepare(
                            `SELECT pipeline_stage FROM leads WHERE phone_normalized = ?`
                        ).bind(phone).first() as any;
                        if (!cur || cur.pipeline_stage === 'new' || cur.pipeline_stage === null) {
                            await env.pintarweb_scraper_db.prepare(
                                `UPDATE leads SET pipeline_stage = 'images_collected', updated_at = CURRENT_TIMESTAMP WHERE phone_normalized = ?`
                            ).bind(phone).run();
                        }
                    }
                }
```

- [ ] **Step 2: Verify**

Manual verification:
1. `PATCH /api/leads/test/intake` with `{ images_collected: 2 }` for a `new` lead
2. Check that `pipeline_stage` changed to `images_collected`
3. Repeat with `images_collected: 0` — stage should NOT change

- [ ] **Step 3: Commit**

```bash
git add packages/scraper/src/api/worker.ts
git commit -m "feat: auto-advance to images_collected on intake image upload"
```

---

### Task 2: Stage Validation for images_collected

**Files:**
- Modify: `packages/scraper/src/api/worker.ts` (PATCH /stage endpoint)

**Interfaces:**
- Consumes: `PATCH /api/leads/:phone/stage` with `{ pipeline_stage: "images_collected" }`
- Produces: 400 error if `images_collected < 1`

- [ ] **Step 1: Add validation before UPDATE**

In the `/stage` handler, add a check when target is `images_collected`:

```typescript
                if (!validStages.includes(pipeline_stage)) {
                    return new Response(JSON.stringify({ error: "Invalid stage" }), { status: 400 });
                }
                if (pipeline_stage === "images_collected") {
                    const lead = await env.pintarweb_scraper_db.prepare(
                        `SELECT images_collected FROM leads WHERE phone_normalized = ?`
                    ).bind(phone).first() as any;
                    if (!lead || !lead.images_collected || lead.images_collected < 1) {
                        return new Response(JSON.stringify({
                            error: "Lead must have at least 1 image uploaded before advancing to images_collected stage"
                        }), { status: 400 });
                    }
                }
                await env.pintarweb_scraper_db.prepare(
```

- [ ] **Step 2: Update dashboard `advanceStage` to show error toast**

In `updatePipelineStage` (line 502), modify to return the promise and handle errors:

```javascript
function updatePipelineStage(phone, stage) {
    return fetch(`/api/leads/${encodeURIComponent(phone)}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pipeline_stage: stage })
    }).then(function(r) {
        if (!r.ok) {
            return r.json().then(function(data) {
                throw new Error(data.error || 'Failed to advance stage');
            });
        }
        fetchLeads();
    }).catch(function(e) {
        console.error(e);
        showToast(e.message, 'error');
    });
}
```

Add a `showToast` helper if it doesn't exist (check dashboard.js.txt for existing toast functions):

```javascript
function showToast(msg, type) {
    var t = document.createElement('div');
    t.className = 'fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-xl text-white font-bold text-sm shadow-2xl transition-all duration-300 ' + (type === 'error' ? 'bg-red-600' : 'bg-emerald-600');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function() { t.style.opacity = '0'; setTimeout(function() { t.remove(); }, 300); }, 4000);
}
```

- [ ] **Step 3: Verify**

1. Try to PATCH a lead with `images_collected = 0` to stage `images_collected` → 400 error
2. Advance a lead with `images_collected > 0` → succeeds

- [ ] **Step 4: Commit**

```bash
git add packages/scraper/src/api/worker.ts packages/scraper/src/ui/js/dashboard.js.txt
git commit -m "feat: validate images_collected before stage advancement, add toast errors"
```

---

### Task 3: Pre-Build Script `prepare-demo-images.sh`

**Files:**
- Create: `scripts/prepare-demo-images.sh`

**Interfaces:**
- Consumes: `bash scripts/prepare-demo-images.sh <lead-id> <niche> [client-dir]`
- Produces: populated `clients/{leadId}/images/` directory

- [ ] **Step 1: Create the script**

```bash
#!/bin/bash
set -e
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd "$(dirname "$0")/.."

LEAD_ID="$1"
NICHE="$2"
CLIENT_DIR="${3:-packages/site-generator/clients/$LEAD_ID}"
IMAGES_DIR="$CLIENT_DIR/images"

if [ -z "$LEAD_ID" ] || [ -z "$NICHE" ]; then
    echo "Usage: bash scripts/prepare-demo-images.sh <lead-id> <niche> [client-dir]"
    echo ""
    echo "Arguments:"
    echo "  lead-id     Lead UUID or slug (e.g. a1b2c3d4 or demo-kl-aircond-pro)"
    echo "  niche       Niche: aircond-contractor, plumbing, electrical, renovation, general"
    echo "  client-dir  Optional override (default: packages/site-generator/clients/<lead-id>)"
    exit 1
fi

# Niche → stock image category mapping
case "$NICHE" in
    aircond-contractor) STOCK_CATEGORY="aircond-service" ;;
    plumbing)           STOCK_CATEGORY="plumbing" ;;
    electrical)         STOCK_CATEGORY="electrical" ;;
    renovation)         STOCK_CATEGORY="renovation" ;;
    general)            STOCK_CATEGORY="" ;;
    *)                  STOCK_CATEGORY="" ;;
esac

STOCK_DIR="packages/site-generator/design-system/references/image-collections/$STOCK_CATEGORY"

echo "═══════════════════════════════════════════"
echo "  Prepare Demo Images"
echo "═══════════════════════════════════════════"
echo "  Lead:    $LEAD_ID"
echo "  Niche:   $NICHE"
echo "  Target:  $IMAGES_DIR"
echo "  Stock:   ${STOCK_DIR:-"(none)"}"
echo ""

mkdir -p "$IMAGES_DIR"

# Helper: check if a file with any extension exists
file_exists() {
    local base="$1"
    local dir="$2"
    # shellcheck disable=SC2012
    ls "$dir/$base".* 2>/dev/null | head -1 | grep -q .
}

# Helper: download from R2 public URL if possible
r2_base="https://pub-${CLOUDFLARE_ACCOUNT_ID:-ACCOUNT}.r2.dev/pintarweb-client-images"

download_r2() {
    local prefix="$1"
    local target="$2"
    local url="$r2_base/$LEAD_ID/$prefix"
    # Try with common extensions
    for ext in webp png jpg jpeg svg; do
        local u="${url%.*}.$ext"
        if curl -sf -o "$target" "$u" 2>/dev/null; then
            echo "  Downloaded R2: $(basename "$target")"
            return 0
        fi
    done
    return 1
}

# Step 1: Download R2 images (best-effort)
echo "Step 1: Downloading from R2..."
download_r2 "logo.*" "$IMAGES_DIR/logo.webp" || true
download_r2 "hero.*" "$IMAGES_DIR/hero.webp" || true
for gi in 1 2 3; do
    download_r2 "gallery-00$gi.*" "$IMAGES_DIR/gallery-$gi.webp" || true
done

# Step 2: Fill missing from stock
if [ -n "$STOCK_CATEGORY" ] && [ -d "$STOCK_DIR" ]; then
    echo ""
    echo "Step 2: Filling missing images from stock ($STOCK_CATEGORY)..."
    for img in hero.webp service-1.webp service-2.webp service-3.webp gallery-1.webp gallery-2.webp gallery-3.webp; do
        if [ ! -f "$IMAGES_DIR/$img" ] && [ -f "$STOCK_DIR/$img" ]; then
            cp "$STOCK_DIR/$img" "$IMAGES_DIR/$img"
            echo "  Filled from stock: $img"
        fi
    done
else
    echo ""
    echo "Step 2: No stock images available for niche '$NICHE'"
fi

# Step 3: Generate initials logo if no logo exists
echo ""
echo "Step 3: Checking logo..."
if ! file_exists "logo" "$IMAGES_DIR"; then
    # Extract business name from config.json
    BUSINESS_NAME=""
    if [ -f "$CLIENT_DIR/config.json" ]; then
        BUSINESS_NAME=$(grep -o '"business_name"[[:space:]]*:[[:space:]]*"[^"]*"' "$CLIENT_DIR/config.json" 2>/dev/null | head -1 | sed 's/.*"business_name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
    fi
    if [ -z "$BUSINESS_NAME" ]; then
        BUSINESS_NAME=$(echo "$LEAD_ID" | sed 's/^demo-//' | sed 's/-/ /g')
    fi

    # Generate initials (max 3 chars)
    INITIALS=$(echo "$BUSINESS_NAME" | sed 's/\(.\)[^ ]* */\1/g' | tr '[:lower:]' '[:upper:]' | sed 's/ //g' | cut -c1-3)
    if [ -z "$INITIALS" ]; then
        INITIALS="PW"
    fi

    PRIMARY_COLOR="#1B4332"  # trustworthy-local default
    if [ -f "$CLIENT_DIR/config.json" ]; then
        MOOD=$(grep -o '"mood"[[:space:]]*:[[:space:]]*"[^"]*"' "$CLIENT_DIR/config.json" 2>/dev/null | head -1 | sed 's/.*"mood"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/')
        case "$MOOD" in
            bold-urgent)   PRIMARY_COLOR="#111111" ;;
            premium-modern) PRIMARY_COLOR="#111827" ;;
            *)             PRIMARY_COLOR="#1B4332" ;;
        esac
    fi

    cat > "$IMAGES_DIR/logo.svg" << LOGOSVG
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" rx="40" fill="$PRIMARY_COLOR"/>
  <text x="100" y="120" font-family="Plus Jakarta Sans, sans-serif" font-size="80" font-weight="700" fill="white" text-anchor="middle" dominant-baseline="middle">$INITIALS</text>
</svg>
LOGOSVG
    echo "  Generated initials logo: $INITIALS"
else
    echo "  Logo exists, skipping"
fi

echo ""
echo "✅ Images ready in: $IMAGES_DIR"
ls -la "$IMAGES_DIR/" 2>/dev/null
```

- [ ] **Step 2: Make executable**

```bash
chmod +x scripts/prepare-demo-images.sh
```

- [ ] **Step 3: Verify**

```bash
mkdir -p /tmp/test-prepare/images
bash scripts/prepare-demo-images.sh test-lead general /tmp/test-prepare
ls -la /tmp/test-prepare/images/
# Should see logo.svg with initials
```

- [ ] **Step 4: Commit**

```bash
git add scripts/prepare-demo-images.sh
git commit -m "feat: add prepare-demo-images.sh for stock image fallback and initials logo"
```

---

### Task 4: Update Dashboard Build Command

**Files:**
- Modify: `packages/scraper/src/ui/js/dashboard.js.txt`

**Interfaces:**
- Consumes: `buildDemo()` — the niche from `intake-niche` dropdown or `lead.niche`
- Produces: updated `fullCmd` that includes `prepare-demo-images.sh`

- [ ] **Step 1: Update `buildDemo()` to include pre-build step**

In `buildDemo()` (line 897), change the `buildCmd` to include the pre-build script:

```javascript
function buildDemo(phone) {
    const lead = allLeads.find(l => l.phone_normalized === phone);
    if (!lead) return;

    const leadId = lead.id || phone;
    const tagline = document.getElementById('intake-tagline')?.value || lead.tagline;
    const niche = document.getElementById('intake-niche')?.value || lead.niche || lead.category;
    const services = lead.services ? JSON.parse(lead.services) : [];
    const testimonials = lead.testimonials ? JSON.parse(lead.testimonials) : [];

    /* Save intake overrides to D1 first */
    fetch('/api/leads/' + phone + '/intake', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagline, niche, services, testimonials })
    }).catch(e => console.warn('Failed to save intake:', e));

    const preCmd = 'bash scripts/prepare-demo-images.sh ' + leadId + ' "' + (niche || 'general') + '"';
    const buildCmd = 'bash scripts/build-client.sh ' + leadId;
    const deployCmd = 'bash scripts/deploy-preview.sh';
    const fullCmd = 'cd ~/projects/pintarweb && ' + preCmd + ' && ' + buildCmd + ' && ' + deployCmd;

    const output = document.getElementById('intake-body');
    // ... rest stays the same, just needs to reference the new fullCmd
```

Replace the existing `fullCmd` line and the commands display block to show 3 steps:

```javascript
    if (output) {
        output.innerHTML = `
            <div class="space-y-4">
                <div class="bg-slate-900 text-green-400 px-5 py-4 rounded-2xl font-mono text-xs overflow-x-auto">
                    <div class="text-[9px] text-green-600 mb-1 uppercase tracking-wider">Step 1: Prepare Images</div>
                    <pre class="whitespace-pre-wrap">${preCmd}</pre>
                </div>
                <div class="bg-slate-900 text-green-400 px-5 py-4 rounded-2xl font-mono text-xs overflow-x-auto">
                    <div class="text-[9px] text-green-600 mb-1 uppercase tracking-wider">Step 2: Build CSS</div>
                    <pre class="whitespace-pre-wrap">${buildCmd}</pre>
                </div>
                <div class="bg-slate-900 text-green-400 px-5 py-4 rounded-2xl font-mono text-xs overflow-x-auto">
                    <div class="text-[9px] text-green-600 mb-1 uppercase tracking-wider">Step 3: Deploy</div>
                    <pre class="whitespace-pre-wrap">${deployCmd}</pre>
                </div>
                <div class="text-center pt-2">
                    <button onclick="navigator.clipboard.writeText('${fullCmd}')" class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase transition-all">
                        Copy Full Command
                    </button>
                    <p class="text-xs text-slate-400 mt-2">Copied to clipboard!</p>
                </div>
            </div>
        `;
    }
```

- [ ] **Step 2: Commit**

```bash
git add packages/scraper/src/ui/js/dashboard.js.txt
git commit -m "feat: add prepare-demo-images.sh to build pipeline in dashboard"
```

---

### Task 5: Update AGENTS.md Logo Rules

**Files:**
- Modify: `packages/site-generator/AGENTS.md`

- [ ] **Step 1: Update Image Pipeline section**

Add logo rule after the existing image pipeline rules:

```markdown
3. **Logo:** Always reference `images/logo.{svg|webp|png}` in the nav and footer. If exists, show as `<img>`. If not, fall back to business name text. The `prepare-demo-images.sh` script always generates a `logo.svg` with initials, so the file will always exist.
```

Add nav/footer logo template rules after the Image Pipeline section:

```markdown
## Logo Placement

Every demo site must include the logo image in:
1. **Navigation header**: `<img src="images/logo.svg" alt="{Business Name}" class="h-8 w-auto">` — place it left of the business name text, wrapped in an `<a>` or `<div>` with `flex items-center gap-2`
2. **Footer**: Same `<img>` before or above the business name `<p>` tag in the business info column
```

- [ ] **Step 2: Commit**

```bash
git add packages/site-generator/AGENTS.md
git commit -m "docs: add logo placement rules to AGENTS.md"
```
