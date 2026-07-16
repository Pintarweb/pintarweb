# PintarWeb — Future To-Do

Pending items across the project.

---

## WhatsApp Bot

- [x] **Multi-tenant migration Phase 6 (admin dashboard)** — Done 2026-07-13. Dashboard split from 1 monolithic file (~1235 lines) into 7 modular files (~1012 lines): index.html, api.js, layout.js, modals.js, dashboard.js, client-detail.js, kb.js, kb-editor.js. Client modal uses persistent injection pattern, WABA modal replaced prompt() with proper form, overview tab fixed. See docs/adr/001-multi-tenant-whatsapp-bot.md.
- [x] **Multi-tenant migration Phase 7 (bot worker refactor)** — Done 2026-07-13. Bot worker split from 1 file (~1747 lines) into 5 modules (~1163 lines total): index.ts (entry), types.ts (interfaces + FAQ + constants), kb.ts (tenant context + WhatsApp sending + message storage), bot-logic.ts (intent classification + LLM + message handling), admin-api.ts (all admin REST routes + niches endpoint). See workers/whatsapp-bot/src/.
- [ ] **Multi-tenant Phase 8** — Automate onboarding (self-serve signup flow, payment integration)

- [ ] **Referral incentive structure** — Decide on referral reward (e.g., 1 month free, cash reward, credit toward renewal). Currently templates say "details later" — need to finalize and update all 3 template files.

---

## Outreach

- [ ] **Referral incentive** — Finalize referral program reward structure (see above)

---

## Site Generator

- [ ] Review and potentially remove "RM800 anchor price" references from generated site configs and historical plan docs — low priority, historical

---

## Razorpay / Billing

- [ ] Set up Razorpay recurring billing for monthly renewals (after 3-month advance period)
- [ ] Document billing flow: 3-month advance → monthly auto-renew

---

- [x] **Electrician niche KB added** (2026-07-12) — Layer 2 KB for electrical vertical. 134-line doc at docs/deep-research/electrician KB/. Urgency-tiered symptom matrix, Suruhanjaya Tenaga licensing, strict DIY boundaries, DB upgrade upsell pattern, TNB scope boundary. Stress-tested with lessons pre-loaded from aircond/plumbing/renovation KBs.

## COMPLETED (2026-07-13)

- [x] Bot worker refactor — split ~1747 lines → 5 modules (~1163 lines): index.ts, types.ts, kb.ts, bot-logic.ts, admin-api.ts
- [x] Dashboard refactor — split ~1235 lines → 7 files (~1012 lines): index.html, api.js, layout.js, modals.js, dashboard.js, client-detail.js, kb.js, kb-editor.js
- [x] Fix GET /wabas listing (was requiring ID even for list all)
- [x] Fix overview tab broken by WABA listing bug
- [x] Fix client modal injection pattern (was broken on SPA re-renders from client detail)
- [x] Replace WABA modal prompt() with proper form modal
- [x] Add GET /admin/api/niches endpoint (returns Layer 2 niche KB: aircond, pintarweb, plumbing)

---

## COMPLETED (2026-07-12)

- [x] Fix landing page cancellation FAQ — now says "Tiada kontrak. Boleh berhenti bila-bila, notify kami 14 hari awal. Tiada penalti."
- [x] Fix landing page CTA "Mula Hari Ini" — removed "Bayar 3 bulan, dapat 4 bulan" misleading text
- [x] Sync all outreach templates with correct pricing (RM297 + RM149 = RM446)
- [x] Sync bot FAQ answers with correct pricing and no-contract

---

*Last Updated: 2026-07-13*
