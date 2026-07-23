# Pintarweb Deployment Workflow

## Quick Reference

| | URL |
|---|---|
| **Production** | https://preview.pintarweb.com |
| **Pages.dev** | https://pintarweb-preview.pages.dev |
| **Dashboard** | https://dash.cloudflare.com/ > Pages > pintarweb-preview |

---

## Deploy a New Client Site

1. Build the client site in `packages/site-generator/clients/{business-id}/`
   ```
   packages/site-generator/clients/
   └── {business-id}/
       ├── index.html
       ├── audit.html
       ├── report.html
       ├── images/
       └── config.json
   ```

2. Run the 3-step build pipeline (from project root):
   ```bash
   cd ~/projects/pintarweb

   # Step 1: Prepare demo images (download R2 + stock fill + logo)
   bash scripts/prepare-demo-images.sh {lead-id} {niche}

   # Step 2: Build client CSS
   bash scripts/build-client.sh {business-id}

   # Step 3: Deploy to preview.pintarweb.com
   bash scripts/deploy-preview.sh
   ```

3. Verify the site is live:
   ```
   https://preview.pintarweb.com/{business-id}/
   https://preview.pintarweb.com/{business-id}/audit.html
   https://preview.pintarweb.com/{business-id}/report.html
   ```

---

## Update an Existing Site

1. Make changes to the client files in `packages/site-generator/clients/{business-id}/`

2. Run the deploy script:
   ```bash
   ./scripts/deploy-preview.sh
   ```

3. The update is immediate. Verify by visiting the URL or hard-refresh (Ctrl+Shift+R).

---

## Manual Deploy (Without Script)

From the project root:
```bash
npx wrangler pages deploy packages/site-generator/clients \
  --project-name=pintarweb-preview \
  --branch=main \
  --commit-dirty=true
```

- `--project-name=pintarweb-preview` — deploys to the existing Pages project
- `--branch=main` — deploys to production branch (served on custom domain)
- `--commit-dirty=true` — allows deploy with uncommitted changes

---

## Check Deployment Status

```bash
# List all deployments
npx wrangler pages deployment list --project-name=pintarweb-preview

# Show only latest 3
npx wrangler pages deployment list --project-name=pintarweb-preview | head -7
```

### Understanding Deployment Status
- **Production** + **Success** = Live on `preview.pintarweb.com`
- **Preview** = Live on `{id}.pintarweb-preview.pages.dev` only
- **Failure** = Build failed, not deployed

---

## Rollback

### Option A: Via Dashboard (Recommended)
1. Open Cloudflare Dashboard: https://dash.cloudflare.com/
2. Navigate to Workers & Pages > Pages > pintarweb-preview
3. Go to the **Deployments** tab
4. Find the previous working deployment
5. Click the triple-dot menu > **Rollback to this deployment**
6. Confirm rollback

### Option B: Redeploy from CLI
```bash
# Re-deploy last known good state
git checkout <last-good-commit> -- packages/site-generator/clients/
./scripts/deploy-preview.sh
```

---

## Troubleshooting

### Site returns 404 on custom domain
1. Check DNS: `dig preview.pintarweb.com` — should return Cloudflare IPs
2. Check deployment status: `wrangler pages deployment list --project-name=pintarweb-preview`
3. Verify deployment is on `main` branch (Production environment)
4. Redeploy to `main` branch: `./scripts/deploy-preview.sh`

### Images not loading
- Images must be inside `clients/{business-id}/images/` directory
- Ensure WebP format (preferred) or PNG/JPG
- Path in HTML must be relative to index.html (e.g., `images/hero.webp`)

### Deploy command fails
1. Check you're in the project root: `cd ~/projects/pintarweb`
2. Verify wrangler is installed: `which wrangler`
3. Check Cloudflare login: `wrangler whoami`
4. Verify project exists: `wrangler pages project list | grep pintarweb-preview`

### CSS/JS not updating
- Cloudflare Pages caches aggressively. Hard-refresh: `Ctrl+Shift+R`
- Or visit the direct deploy URL: `https://<id>.pintarweb-preview.pages.dev/`
- Add cache-busting query param: `?v=1` in the URL

---

## Deploy Scripts Reference

### Full 3-step pipeline
```bash
# All 3 steps in sequence
bash scripts/prepare-demo-images.sh {lead-id} {niche} && \
bash scripts/build-client.sh {business-id} && \
bash scripts/deploy-preview.sh
```

### Individual scripts

**File: `scripts/prepare-demo-images.sh`**
- Downloads client images from R2 bucket `pintarweb-client-images`
- Fills missing image slots from niche stock directory
- Generates `images/logo.svg` with business initials + mood color
- Output: `packages/site-generator/clients/{id}/images/`

**File: `scripts/build-client.sh`**
- Compiles Tailwind CSS + custom styles into purged `style.css`
- Scans HTML for used Tailwind classes

**File: `scripts/deploy-preview.sh`**
```bash
#!/bin/sh
set -e
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd "$(dirname "$0")/.."

echo "Deploying to pintarweb-preview (preview.pintarweb.com)..."
npx wrangler pages deploy packages/site-generator/clients \
  --project-name=pintarweb-preview \
  --branch=main \
  --commit-dirty=true

echo "Deployed: https://preview.pintarweb.com"
echo "Latest:   https://main.pintarweb-preview.pages.dev"
```

---

**Last Updated:** 2026-07-23
