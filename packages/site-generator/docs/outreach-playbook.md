# Outreach Playbook

## Core Philosophy
The outreach message is the first impression of the website quality.
If the message feels automated or generic — the report gets ignored
regardless of how good it looks.

Every message must feel like a human noticed THIS specific business.
Not a blast. Not a template. An observation.

---

## The Three Fears You Are Writing Against

Every SME owner reading your message is unconsciously asking:

**"Is this a scam?"**
Anything too good, too free, too easy triggers this immediately.
Your message must feel earned and specific — not promotional.

**"Will this waste my time?"**
If your message hints at a sales call, a meeting, a pitch — they check out.
Remove all friction language. Never mention "pakej", "harga", or "promosi" in touch 1.

**"Do I even need this?"**
Most SMEs don't feel the pain of no website until you show them.
That's why the report link goes in touch 1 — curiosity drives the click.

---

## Message Timing

Best windows for Malaysian trades and services:

| Time | Why |
|------|-----|
| 7:00–8:30am | Before jobs start, checking phone |
| 12:30–2:00pm | Lunch break, relaxed |
| 9:00–10:30pm | Day done, scrolling phone |

Avoid 9am–12pm and 2pm–6pm — message gets buried under work notifications.

---

## Touch 1 — First Outreach (Day 0)

### Standard (no website, no social)
```
Hi [Name], kami check online presence [Business Name] —
ada buat report + demo website untuk awak.
Boleh tengok: [report URL]

Ada soalan boleh tanya sini.
```

### Social-aware (Instagram/TikTok active)
```
Hi [Name], nampak [Business Name] ada Instagram yang active —
project photos nampak bagus. Kami buat quick report pasal
online presence awak + demo website. Boleh tengok:
[report URL]
```

### Has weak website
```
Hi [Name], kami check website [Business Name] —
ada beberapa benda yang boleh improve untuk conversion.
Kami dah sediakan report + demo versi baru. Boleh tengok:
[report URL]
```

**Rules for Touch 1:**
- Under 4 lines total
- Report link in every first message — always
- No price mention
- No "pakej" or "promosi" language
- End with soft open — never a question that demands commitment
- Use their actual business name, not just "bisnes awak"

---

## Touch 2 — Follow Up (Day 3)

Only send if no reply. Always attach something new — never send
"just following up" standalone.

```
Just nak check — link tu okay tak dari phone awak?
```

Or if you made a small update to their demo:
```
Tadi update sikit demo website awak — dah tambah
[specific thing e.g. "section servis area"]. Link sama:
[report URL]
```

**Why this works:** Gives them a reason to re-engage without pressure.
The "did the link work" question is non-threatening and gets replies
even from people who aren't interested yet.

---

## Touch 3 — Soft Close (Day 7)

Still no reply. Create mild scarcity without being pushy.

```
Demo + report untuk [Business Name] masih live.
Kalau ada soalan atau nak proceed boleh reach out bila-bila.
Kalau tak berminat pun okay je — kami akan allocate
slot ni untuk bisnes lain dalam area yang sama.
```

**What this does:**
- "Area yang sama" implies a competitor might get it
- "Okay je" removes pressure — paradoxically increases replies
- This is your last touch before moving on

---

## Handling Replies

### "Berapa harga?"
Never answer with a number immediately. Build value first.

```
Bergantung sikit pada apa yang awak nak. Boleh saya
tunjukkan dulu apa yang included dalam demo tu?
Awak dah tengok ke belum?
```

Get them to confirm they've seen the demo before discussing price.
Price after value, never before.

### "Boleh fikir dulu"
Don't push. Acknowledge and stay warm.

```
Okay no problem, take your time. Demo still up —
[URL]. Bila-bila ready boleh reach out terus sini.
```

Follow up in 5–7 days with something new — a section update,
a new feature added, their Google reviews now showing on the site.

### "Macam mana nak proceed?"
This is your green light. Move fast.

```
Senang je — saya connect domain awak terus ke website ni.
Awak ada domain sendiri ke, atau nak kami register sekali?

Lepas confirm, website live dalam masa 5 hari bekerja.
RM 149/bulan — 3 bulan advance (RM 447). Termasuk semua.
```

### "Tak berminat"
Never argue. Pivot to referral immediately.

```
No worries, terima kasih sebab reply! Kalau ada
kenalan — contractor, aircond, renovation — yang nak
website, boleh refer ke kami. Ada referral fee untuk awak. 🙏
```

### No reply after Touch 3
Move on. Mark as `closed-lost` in leads.csv with note "no response."
Revisit in 3 months with a new angle — your product will be better by then.

---

## Closing Sequence

When a lead is warm and engaging:

**Step 1 — Confirm they've seen it**
"Dah sempat tengok demo tu?"

**Step 2 — Invite feedback**
"Ada bahagian yang nak ubah sikit? Boleh adjust."

**Step 3 — Make a small tweak fast**
Do one small change they suggest within the same day.
This proves responsiveness and builds micro-trust.
It also gets them invested — they've contributed to the site now.

**Step 4 — Connect close to their pain**
```
Kalau kita connect domain awak, orang search
"[service] [area]" boleh jumpa awak terus.
Kami handle semua — awak focus bisnes je.
```

**Step 5 — State price simply**
```
RM 149/bulan — 3 bulan advance (RM 447).
Termasuk website, SEO, auto-reply WhatsApp, hosting, maintenance.
Kurang dari satu job chemical wash sebulan.
```

Monthly framing: "RM 149/bulan — kurang dari satu job chemical wash" lands harder than annual math for this audience.

**Step 6 — Remove payment friction**
- Accept DuitNow, bank transfer, cash
- Send DuitNow QR or account number immediately when they agree
- Don't invoice — just confirm receipt via WhatsApp
- Simple is better at Stage 1

---

## After Payment

- [ ] Confirm payment received via WhatsApp
- [ ] Ask: domain they want, or shall you register one?
- [ ] If registering: confirm spelling, extension (.com.my recommended)
- [ ] Connect domain to Cloudflare Pages (15–30 minutes)
- [ ] Send live URL when done
- [ ] Update leads.csv: `outreach_status = closed-won`
- [ ] Log full entry in `docs/field-notes.md`
- [ ] Set reminder for renewal 11 months from payment date

---

## Referral System (Stage 1)

Every rejection is a potential referral source.
Every closed client is your best referral source.

**For rejections — always send the referral pivot (Touch 3 reply above)**

**For closed clients — after site goes live:**
```
Terima kasih [Name]! Website dah live.
Kalau ada kenalan yang nak website jugak, boleh refer
ke kami — ada referral fee RM [50–100] untuk awak
kalau jadi client. 🙏
```

Track referral sources in leads.csv under `source` column.

---

## Language Notes

- Mix BM and English naturally — matches how Malaysian SMEs actually message
- "Boleh" is softer than "can" — use it for requests
- "Okay je" signals no pressure — use it after rejections
- Avoid formal Malay (tidak, adalah, bagi) — too stiff for WhatsApp
- Avoid full English — feels corporate and distant
- Emoji: one at most per message, only at the end, never in Touch 1

---

## Automation Scripts

All scripts live in `scripts/`:

| Script | Purpose |
|--------|---------|
| `process-leads.sh` | Score leads with data-opportunity algorithm |
| `generate-audit.sh` | Build P.A.S.T. audit HTML with calculator |
| `generate-whatsapp.sh` | Generate WhatsApp pre-fill URLs (BM/EN) |
| `generate-demo.sh` | Unified workflow wrapper |
| `init-outreach-db.sh` | Initialize D1 tables |
| `add-lead.sh` | Add lead to D1 tracking |
| `track-event.sh` | Track outreach events |
| `view-outreach.sh` | Dashboard view |

### Lead Scoring Algorithm
- +50: No website + active social (data opportunity)
- +40: No website + no social
- +20: Has both website and social
- +15: Google rating < 4.0
- -10: Review count > 50
- -5: Active social

### D1 Database
- Database ID: `1ca959be-b1bc-4b03-87df-8e4610659993`
- Tables: `outreach_leads`, `outreach_events`
- Use `--remote` flag with wrangler commands