#!/bin/bash
set -e
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd "$(dirname "$0")/.."

CLIENT_ID="${1:-}"
if [ -z "$CLIENT_ID" ]; then
  echo "Usage: build-client.sh <client-id>"
  echo "Example: build-client.sh test-razif"
  exit 1
fi

CLIENT_DIR="packages/site-generator/clients/$CLIENT_ID"
if [ ! -d "$CLIENT_DIR" ]; then
  echo "Error: Client directory not found: $CLIENT_DIR"
  exit 1
fi

echo "🔨 Building CSS for $CLIENT_ID..."
TW="packages/site-generator/node_modules/.bin/tailwindcss"
"$TW" \
  -i packages/site-generator/src/input.css \
  -o "$CLIENT_DIR/style.css" \
  --content "$CLIENT_DIR/index.html" \
  --minify \
  --config packages/site-generator/tailwind.config.js

echo "✅ Built: $CLIENT_DIR/style.css"
ls -la "$CLIENT_DIR/style.css"
