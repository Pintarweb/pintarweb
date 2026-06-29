#!/bin/sh
set -e
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd "$(dirname "$0")/.."

echo "🚀 Deploying to pintarweb-preview (preview.pintarweb.com)..."
npx wrangler pages deploy packages/site-generator/clients \
  --project-name=pintarweb-preview \
  --branch=main \
  --commit-dirty=true

echo "✅ Deployed: https://preview.pintarweb.com"
echo "   Latest:   https://main.pintarweb-preview.pages.dev"
