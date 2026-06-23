#!/bin/sh
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd "$(dirname "$0")/../packages/scraper"
exec npx tsx src/index.ts "$@"
