# PintarWeb

Website-as-a-Service for Malaysian SME tradespeople. Build and deploy a professional website + WhatsApp bot + local SEO for aircond contractors, plumbers, electricians, and renovation specialists.

**Live:** [pintarweb.com](https://pintarweb.com)

---

## What We Build

A complete digital presence for tradespeople — mobile-friendly website, WhatsApp auto-reply bot, and Google Business Profile optimization. All in 4 weeks.

---

## Pricing (RM446 total)

| | Amount | When |
|---|---|---|
| Setup fee | RM297 | Day 0 — to start build |
| Activation | RM149 | Delivery day — to go live |
| **Total** | **RM446** | Includes 1 month FREE bonus |
| Renewal | RM149/mo | From month 5 |

**Maybank:** 562021737846 (PintarWeb Enterprise)

---

## Products

### Website
- Mobile-first, 3-5 page static site
- BM/EN language toggle
- WhatsApp CTA, gallery, testimonials, contact form
- Real images — no placeholders
- Deployed to Cloudflare Pages

### WhatsApp Bot
- 24/7 auto-reply receptionist
- 22-intent keyword classifier — no LLM needed for routing
- DeepSeek v4 Flash for conversational fallback
- Split payment closing flow (2-path: Ready vs Need to Know More)
- Configured per-client via D1

### Local SEO
- Google Business Profile setup and optimization
- "Near me" search optimization
- Local keyword targeting

---

## Architecture

```
pintarweb/
├── packages/
│   ├── site-generator/     # Static HTML site builder + CSS build
│   └── scraper/            # Lead generation (Playwright → D1)
├── workers/
│   └── whatsapp-bot/       # Cloudflare Worker — WhatsApp bot
├── scripts/                # Automation scripts (D1, Resend, Razorpay)
├── docs/
│   ├── plans/              # Phase 1-4 implementation plans
│   ├── outreach/           # WhatsApp message templates
│   ├── sop/                # Demo build SOP
│   └── deep-research/      # Niche research (aircond, trades, reno)
└── design-system/          # Mood tokens, reference components
```

---

## Key Scripts

```bash
# Prepare demo images (download R2 + stock fill + logo gen)
bash scripts/prepare-demo-images.sh {lead-id} {niche}

# Build client CSS (after generating HTML)
bash scripts/build-client.sh {client-id}

# Deploy all client previews
bash scripts/deploy-preview.sh

# Generate demo site + audit + WhatsApp link
bash scripts/generate-demo.sh --name "Business" --phone "60123456789" --area "KL" --niche "aircond"

# Add lead to D1
bash scripts/add-lead.sh "Business" "60123456789" "KL" "aircond" --score 65

# Track outreach event
bash scripts/track-event.sh "[lead-id]" "demo_sent"

# Confirm payment (split: RM297 setup / RM149 activation)
bash scripts/confirm-payment.sh "[lead-id]" "297" "TRX123" --email "cust@email.com"

# Send billing reminder to all pilots (month 3 end)
bash scripts/billing-reminder.sh

# Create Razorpay subscription (month 4)
bash scripts/create-subscription.sh "[lead-id]" "monthly"
```

---

## Deployment

| Component | Platform | URL |
|---|---|---|
| Landing page | Cloudflare Pages | pintarweb.com |
| WhatsApp bot | Cloudflare Workers | pintarweb-whatsapp-bot.yusmarin.workers.dev |
| Analytics | Umami Cloud | cloud.umami.is |
| Database | Cloudflare D1 | pintarweb-claude-db |

---

## WhatsApp Bot

**Worker:** `workers/whatsapp-bot/src/index.ts`
**Deployed:** `https://pintarweb-whatsapp-bot.yusmarin.workers.dev`
**WABA ID:** 727271803683109

**Intent taxonomy (22 intents):**
- FAQ: packages, setup fee, subscribe, contract, timeline, requirements, support, ownership, update, renewal, domain, WhatsApp number, local SEO, satisfaction, see before live, PDPA, payment methods, maintenance, tech savvy, add services
- Action: price enquiry, subscribe, closing ready
- Meta: how it works, support, escalate, unclear

**Closing flow:**
- Path A (Ready): Maybank details sent, owner notified
- Path B (Need to Know More): FAQ sent, owner follows up personally

---

## Development

```bash
# Install
pnpm install

# 3-step demo build pipeline
bash scripts/prepare-demo-images.sh {lead-id} {niche}   # Download R2 + stock fill + logo
bash scripts/build-client.sh {client-id}                 # Build CSS
bash scripts/deploy-preview.sh                           # Deploy to preview

# Deploy WhatsApp bot
cd workers/whatsapp-bot && npx wrangler deploy
```

---

## Status

- Phase 1 (Foundation): ✅ Complete
- Phase 1.5 (Website Integration): ✅ Complete
- Phase 2 (Automation): ✅ Complete
- Phase 3 (WhatsApp Bot): ✅ Built & Deployed
- Phase 4 (Launch): Ready to execute

See `docs/plans/MASTER-CHECKLIST.md` for full detail.

---

## License

Proprietary. All rights reserved. PintarWeb Enterprise.
