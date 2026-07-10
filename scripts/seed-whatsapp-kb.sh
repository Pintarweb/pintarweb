#!/bin/bash
# Seed WhatsApp Bot Knowledge Base
# Usage: bash scripts/seed-whatsapp-kb.sh [--local] [--remote]
# Defaults to --local. Use --remote for production D1.

set -e

TARGET="--local"
DB_NAME="pintarweb-claude-db"

while [[ $# -gt 0 ]]; do
    case $1 in
        --remote)
            TARGET="--remote"
            shift
            ;;
        --local)
            TARGET="--local"
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

echo "🌱 Seeding WhatsApp Bot Knowledge Base..."
echo "Target: $TARGET"

# Execute seed SQL file
npx wrangler d1 execute "$DB_NAME" $TARGET --file=scripts/seed-whatsapp-kb.sql

echo ""
echo "✅ Seeding complete!"
