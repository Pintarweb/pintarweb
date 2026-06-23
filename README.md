# Pintarweb Monorepo

Malaysian SME website factory. Static HTML demos + JavaScript widgets for interactive features.

## Architecture

- **Static HTML + Tailwind CSS** for client demo sites (fast, cheap, AI-generated)
- **JavaScript widgets** for interactive features (chat, booking, auto-reply)
- **Cloudflare Workers + D1** for backend services
- **Scraper** for lead generation (Playwright + Cloudflare Workers)

## Packages

| Package | Description |
|---------|-------------|
| `@pintarweb/site-generator` | Static HTML demo sites + audit reports |
| `@pintarweb/widgets` | JavaScript widgets (chat, booking, auto-reply) |
| `@pintarweb/scraper` | Lead generation (Playwright + Cloudflare Workers) |
| `@pintarweb/shared` | Shared types, schemas, configs |

## Directory Structure

```
pintarweb/
├── packages/
│   ├── site-generator/    # Static HTML demos + audit reports
│   ├── widgets/           # JavaScript widgets (chat, booking)
│   ├── scraper/           # Lead generation
│   └── shared/            # Shared types, schemas
├── marketing/             # Marketing content, campaigns
├── data/                  # Shared data (leads JSON)
└── scripts/               # Shared scripts
```

## Development

```bash
# Install dependencies
pnpm install

# Run all dev servers
pnpm dev

# Build all packages
pnpm build

# Deploy all Cloudflare Workers
pnpm deploy

# Run tests
pnpm test
```

## Individual Package Commands

```bash
# Site generator
cd packages/site-generator
pnpm dev          # Start Cloudflare dev server
pnpm deploy       # Deploy to Cloudflare

# Scraper
cd packages/scraper
pnpm dev          # Start Cloudflare dev server
pnpm scrape       # Run scraper CLI

# Widgets
cd packages/widgets
pnpm dev          # Watch mode for development
pnpm build        # Build for production

# Shared
cd packages/shared
pnpm dev          # Watch mode for type changes
pnpm build        # Build types
```

## Widget Usage

Load widgets from CDN and initialize:

```html
<script src="https://cdn.pintarweb.com/widgets/chat.js"></script>
<script>
  initWhatsAppWidget({
    phoneNumber: '60123456789',
    message: 'Hi, I would like to inquire about your services.',
    position: 'bottom-right',
    size: 'medium'
  });
</script>
```

## Environment Variables

Each package has its own `.env` file (gitignored):

- `packages/site-generator/.env` — Cloudflare, API keys
- `packages/scraper/.env` — OpenAI, Cloudflare credentials

## Deployment

- **Site Generator**: Cloudflare Pages + Workers
- **Scraper**: Cloudflare Workers
- **Widgets**: Cloudflare R2 (CDN)

## Business Model

Website-as-a-Service for Malaysian SME tradespeople (aircond, contractors, trades).

- **Asas**: RM 149/mo — Website + SEO + WhatsApp auto-reply
- **Bisnes**: RM 299/mo — + Booking + Reviews + Analytics
- **Pro**: RM 499/mo — + Chatbot + Voice AI + CRM

## License

Proprietary. All rights reserved.
