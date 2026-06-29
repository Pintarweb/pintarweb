#!/bin/sh
set -e
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd "$(dirname "$0")/.."

echo "🚀 Deploying landing page to pintarweb-main (pintarweb.com)..."
npx wrangler pages deploy packages/site-generator/landing \
  --project-name=pintarweb-main \
  --branch=main \
  --commit-dirty=true

echo "✅ Deployed: https://pintarweb.com"
echo "   Preview:  https://main.pintarweb-main.pages.dev"
