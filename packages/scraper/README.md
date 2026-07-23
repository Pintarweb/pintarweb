# 🚀 PintarWeb Lead Intelligence Engine

Professional-grade lead generation and intelligence pipeline designed for Malaysian SMEs. This engine automates the discovery, technical auditing, and AI-driven qualification of high-value service leads.

## 💎 The Diamond Standard Workflow

1.  **Search & Extract**: Automated Playwright scrapers (`src/scrapers`) hunt for specific business categories across Google Maps, Facebook, and Yellow Pages.
2.  **Intelligence Pipeline**: Leads are piped into a local **Cloudflare Worker** (`src/api/worker.ts`), triggering a multi-layer intelligence suite:
     *   **No-Website Bonus (+3 Points)**: Instantly identifies "Digitally Invisible" businesses.
     *   **Social + No Website Bonus (+3 Points)**: Social presence without a website = high-priority marketing opportunity.
     *   **Technical Audit (+SSL, +Speed)**: Checks for missing HTTPS and slow mobile response times.
     *   **AI Pain-Point Detection (+2 Points)**: Analyzes customer reviews using LLMs to identify specific communication or service gaps.
3.  **Intake Form**: Standalone form (`/clients/intake-form.html`) for collecting social URLs, service areas, tagline, and gallery image uploads (stored in R2). Auto-advances leads through pipeline stages.
4.  **Pipeline Pro Dashboard**: A premium, real-time interface (`localhost:8787/dashboard`) for sales triage, filtering, and lead management.

## 📊 Pipeline Pro Features

*   **Intelligence Scorecard**: Granular pop-up breakdown of exactly why a lead is prioritized.
*   **Dual-Folder System**: Manage the "Active Pipeline" vs. "Archive Vault" for long-term lead tracking.
*   **Advanced Filtering**: Filter by Category, Pipeline State (New/Contacted/Demo), Website presence, and Source.
*   **WhatsApp Integration**: Instant, one-click pitch generation from the dashboard.
*   **Batch Tracking**: "NEW BATCH" pulsing badges identify leads discovered within the last 24 hours.

## 🛠️ Tech Stack

*   **Runtime**: Node.js / TypeScript
*   **Orchestrator**: Cloudflare Workers
*   **Database**: Cloudflare D1 (Local SQLite state)
*   **Scraper Engine**: Playwright
*   **Intelligence**: OpenAI / Cloudflare AI

## 🚀 Getting Started

### 1. Environment Setup
Configure your `.dev.vars` or `.env` file with the following keys:
```env
OPENAI_API_KEY=your_key
CLOUDFLARE_ACCOUNT_ID=your_id
CLOUDFLARE_API_TOKEN=your_token
```

### 2. Launch the Engine
Start the local worker and dashboard:
```bash
npx wrangler dev
```

### 3. Deploy the Scrapers
Run the lead hunters in a new terminal:
```bash
npx tsx src/index.ts
```

## 📂 Project Structure

*   `src/api/`: Cloudflare Worker endpoints and dashboard hosting.
*   `src/scrapers/`: Individual platform scraper implementations (Maps, etc.).
*   `src/workers/`: Background intelligence logic (Audits, AI Qualification).
*   `src/ui/`: The standalone Dashboard HTML module.
*   `src/db/`: Database upsert and de-duplication logic.

## ⚖️ Database Operations

The local database is stored in `.wrangler/state`. To run manual updates or queries:
```bash
npx wrangler d1 execute pintarweb-scraper-db --local --command="SELECT COUNT(*) FROM leads;"
```

---
**Build with Precision | Lead with Intelligence** 🥂💎⚾
