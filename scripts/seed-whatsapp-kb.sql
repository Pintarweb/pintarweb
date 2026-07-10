-- WhatsApp Bot Knowledge Base Seed Data
-- Run: npx wrangler d1 execute pintarweb-claude-db --remote --file=scripts/seed-whatsapp-kb.sql

-- Layer 1: System Prompts
INSERT OR REPLACE INTO whatsapp_bot_system_prompts (id, prompt_type, prompt_text, version, is_active, updated_at)
VALUES (
  'base-v1',
  'base',
  'You are a receptionist for "AC Service Pro" in Kuala Lumpur. You reply to WhatsApp messages from CUSTOMERS.

IMPORTANT RULES — FOLLOW EXACTLY:
1. CRITICAL: Always reply in Malaysian Bahasa Melayu. NEVER use Indonesian words like "emitkan" (use "hantar"), "tersebut", "para". NEVER mix Chinese or other language characters into your reply. NEVER use broken grammar like "saya akan told you team" or "forwarded mensaje".
2. Reply in the SAME language the customer used. Malay → Malay, English → English, Manglish → Manglish.
3. Reply must be 1-2 short sentences MAXIMUM. Never write more.
4. Answer the SPECIFIC question asked. Do not add generic follow-ups like "nak tahu lagi apa-apa, WhatsApp je".
5. NEVER say "terima kasih", "thank you", "you''re welcome" as your main or only reply.
6. NEVER refer to yourself as "I" or "we". You ARE the business. Say "kami" sparingly.
7. NEVER mention AI, bots, automated systems, or that you''re a computer.
8. NEVER make up information not provided above.
9. If you don''t know the answer, say "Saya akan tanya team dan-balik pada anda."
10. Do NOT offer to send links, forms, or anything you can''t actually send.
11. Keep every reply SHORT and CONVERSATIONAL — like chatting with a helpful friend who happens to know the business.',
  1,
  1,
  datetime('now')
);

INSERT OR REPLACE INTO whatsapp_bot_system_prompts (id, prompt_type, prompt_text, version, is_active, updated_at)
VALUES (
  'fallback-v1',
  'fallback',
  'Hmm, saya akan tanya team tentang tu dan-balik pada anda tidak lama. 💬',
  1,
  1,
  datetime('now')
);

-- Layer 2: Niche Knowledge - PINTARWEB
INSERT OR REPLACE INTO whatsapp_bot_niche_knowledge (id, faq_json, price_ranges_json, objections_json, version, is_active, updated_at)
VALUES (
  'pintarweb',
  '[
    {"keywords": ["pakej", "package", "included", "yang saya dapat", "apa yang saya dapat", "dapat apa", "servis apa"], "intent": "FAQ_PACKAGES", "answer": "Pakej PintarWeb termasuk: website (3-5 page, mobile responsive), WhatsApp auto-reply bot (WABA API), local SEO + Google Business Profile, hosting + SSL, dan sokongan WhatsApp. Semua dalam satu pakej ✅"},
    {"keywords": ["fi persediaan", "setup fee", "kenapa bayar", "bayar untuk apa", "one-time", "sebelum"], "intent": "FAQ_SETUP_FEE", "answer": "Fi persediaan RM297 adalah untuk: daftar domain atas nama bisnes anda, setup hosting + SSL, configure WhatsApp Business API (WABA), dan bina website. Ini kos sekali je, bukan bayaran bulanan."},
    {"keywords": ["subscribe", "sign up", "nak mula", "cara nak", "cam mana nak", "macam mana nak", "proceed", "start"], "intent": "FAQ_SUBSCRIBE", "answer": "LANGGAN 2 STEP: 1️⃣ Bayar RM297 (fi persediaan) → kami bina website. 2️⃣ Dalam 4 minggu, bila site siap, bayar RM149 (activation) → bot dipindahkan ke nombor anda dan site go live! ☎️ Website + bot + SEO siap dalam 4 minggu."},
    {"keywords": ["kontrak", "contract", "cancel", "batal", "stop", "keluar", "30 hari"], "intent": "FAQ_CONTRACT", "answer": "Kontrak adalah tahunan. Nak batal? Beritahu kami 30 hari sebelum renewal. Tiada penalti atau denda. Setup fee tidak dikembalikan."},
    {"keywords": ["berapa lama", "how long", "lama", "siap", "live", "ready", "minggu", "weeks", "hari"], "intent": "FAQ_TIMELINE", "answer": "Website siap dalam 4 minggu (28 hari bekerja) dari tarikh anda hantar dokumen dan gambar. Punca kelewatan biasanya lambat hantar dokumen dari pihak pelanggan."},
    {"keywords": ["apa yang perlu", "yang saya perlu", "need from me", "documents", "dokumen", "ssm", "gambar", "photo", "syarat"], "intent": "FAQ_REQUIREMENTS", "answer": "Yang kami perlu: 1) Dokumen SSM bisnes, 2) Gambar kerja sebenar (10-15 keping, telefon pun boleh), 3) Senarai servis dan harga yang anda tawarkan. Itu je! Kami akan tolong siapkan yang lain."},
    {"keywords": ["support", "bantu", "tolong", "help", "masalah", "issues", "rosak", "service"], "intent": "FAQ_SUPPORT", "answer": "Ya! Sokongan WhatsApp termasuk dalam langganan. Hubungi kami bila-bila masa melalui WhatsApp dan kami akan bantu. Untuk masalah teknikal, response dalam 1-2 jam waktu bekerja."},
    {"keywords": ["milik", "own", "hak", "property", "files", "fail", "take", "transfer"], "intent": "FAQ_OWNERSHIP", "answer": "Website adalah MILIK anda 100%. Domain, fail website, dan semua data adalah atas nama bisnes anda. Kalau nak berpindah ke vendor lain, kami akan serahkan semua fail. Tiada sekatan."},
    {"keywords": ["update", "tukar harga", "ubah", "edit", "change", "sendiri", "manage"], "intent": "FAQ_UPDATE", "answer": "Boleh! Anda boleh update harga servis, upload gambar kerja baru, dan tukar teks terus dari telefon melalui WhatsApp. Atau kami tolong tukarkan dalam 24 jam — tak payah buka komputer pun."},
    {"keywords": ["renewal", "renew", "bulanan", "bulan depan", "monthly", "RM149", "month 4", "selepas 4 bulan"], "intent": "FAQ_RENEWAL", "answer": "Selepas 4 bulan, renewal RM149/bulan. Anda boleh pilih: monthly (RM149), quarterly (RM417/3 bulan), 6-bulanan (RM774), atau yearly (RM1,308). Semua include sokongan dan maintenance."},
    {"keywords": ["domain", "nama website", "website name", "daftar", "register"], "intent": "FAQ_DOMAIN", "answer": "Kami yang akan daftar dan uruskan domain atas nama bisnes anda. Anda tak perlu buat apa-apa untuk bahagian ni."},
    {"keywords": ["whatsapp number", "nombor whatsapp", "phone number", "nombor baru", "separate"], "intent": "FAQ_WHATSAPP_NUMBER", "answer": "Kami SARANKAN daftar nombor WhatsApp BARU khas untuk bot (bukan nombor peribadi anda). Ini pastikan mesej bisnes tak bercampur dengan mesej keluarga, dan nombor anda yang lama masih boleh digunakan seperti biasa."},
    {"keywords": ["seo", "google", "maps", "near me", "cari google", "local seo", "google business"], "intent": "FAQ_LOCAL_SEO", "answer": "Local SEO ensure bisnes anda appear dalam Google Maps dan searches tipo these. Bila orang taip aircond service near me atau plumber PJ, bisnes anda akan appear dalam Google Maps. Kami setup dan optimize ini semua untuk anda."},
    {"keywords": ["puas", "satisfied", "tak puas", "revise", "ubah", "design", "ruang"], "intent": "FAQ_SATISFACTION", "answer": "Kami akan revise design sehingga anda puas hati. Revision adalah sebahagian daripada proses. Dalam 4 minggu tu, kami akan tunjukkan draft dan anda boleh minta ubah sehingga anda happy dengan result."},
    {"keywords": ["see", "demo", "tengok", "preview", "sebelum", "before", "view"], "intent": "FAQ_SEE_BEFORE_LIVE", "answer": "Ya! Dalam 4 minggu pembangunan, kami akan hantar link demo untuk anda review. Website tak akan go live sehingga anda bilang okay. Satu langkah dalam masa 4 minggu tu, lepas demo, anda akan nampak semua."},
    {"keywords": ["pdpa", "data", "privacy", "selamat", "safe", "secure", "selindungi"], "intent": "FAQ_PDPA", "answer": "Selamat. Kami patuh Akta Perlindungan Data Peribadi (PDPA) Malaysia. Data anda di-encrypt, tidak dikongsi dengan mana-mana pihak ketiga, dan tidak akan digunakan untuk tujuan lain."},
    {"keywords": ["payment", "bayar", "maybank", "bank", "duitnow", "transfer"], "intent": "FAQ_PAYMENT_METHODS", "answer": "Untuk sekarang, payment via Maybank transfer langsung. Untuk activate dan renew boleh juga guna Maybank transfer. Kami akan share details payment bile masa activate nanti."},
    {"keywords": ["maintain", "maintenance", "selepas", "after", "support"], "intent": "FAQ_MAINTENANCE", "answer": "Maintenance dan sokongan teknikal sudah termasuk dalam langganan bulanan. Kalau ada masalah, WhatsApp kami dan kami akan betulkan. Tidak ada kos tambahan."},
    {"keywords": ["tech savvy", "teknikal", "reti", "tak reti", "beginner", "technically challenged"], "intent": "FAQ_TECH_SAVVY", "answer": "Tidak masalah! PintarWeb direka untuk orang yang bukan IT. Tak perlu reti coding atau manage website. Semua boleh dilakukan melalui WhatsApp — hantar mesej je, kami yang buat."},
    {"keywords": ["tambah", "add more", "extra", "servis tambahan", "page baru", "new page"], "intent": "FAQ_ADD_SERVICES", "answer": "Boleh! Tambah page baru, servis baru, atau update apa-apa — just WhatsApp kami dan kami akan tolong. Cost bergantung pada apa yang anda nak tambah."}
  ]',
  '{
    "setup_fee": "RM297",
    "activation_fee": "RM149",
    "monthly": "RM149/bulan",
    "quarterly": "RM417/3 bulan",
    "biannual": "RM774/6 bulan",
    "annual": "RM1,308/tahun",
    "total_first_4_months": "RM446"
  }',
  '[
    {"objection": "Facebook/Instagram dah cukup", "response": "Facebook dan Instagram bantu bisnes anda reach orang yang DAH FOLLOW anda. Website + SEO bantu orang yang CARI bisnes macam anda di Google — audience yang langsung tak tahu kewujudan anda. Dua-dua penting, tapi fungsi berlainan."},
    {"objection": "Tak reti maintain website", "response": "Tak perlu reti apa-apa! Semua update boleh dilakukan melalui WhatsApp — hantar je apa yang nak tukar, kami yang buat."},
    {"objection": "Mahal", "response": "Satu job chemical wash RM180-350. Kalau website ni dapat 1 customer baru sebulan pun dah cover kos langganan. Lebih baik dari iklan Facebook yang tak guarantee result."}
  ]',
  1,
  1,
  datetime('now')
);

-- Layer 2: Niche Knowledge - AIRCOND
INSERT OR REPLACE INTO whatsapp_bot_niche_knowledge (id, faq_json, price_ranges_json, objections_json, version, is_active, updated_at)
VALUES (
  'aircond',
  '[
    {"keywords": ["aircond tak sejuk", "tak sejuk", "lembap", "weak cooling"], "intent": "SYMPTOM_TROUBLESHOOT", "answer": "Aircond tak sejuk biasanya sebab: 1) Filter dirty — try clean dulu. 2) Gas rendah — ni baru kena check technician. Kalau dah clean filter still tak sejuk, mungkin ada masalah lain."},
    {"keywords": ["aircond bocor", "leck", "air jatuh", "dripping"], "intent": "SYMPTOM_TROUBLESHOOT", "answer": "Aircond bocor air biasanya sebab paip saluran tersumbat atau dirty filter. Cuba flush dengan air suam. Kalau still bocor lepas tu, perlu technician check."},
    {"keywords": ["bau busuk", "bau apak", "mould", "musty smell"], "intent": "SYMPTOM_TROUBLESHOOT", "answer": " Bau tu biasanya dari kulat dalam unit. Cuba running fan mode sometimes untuk circulate udara. Kalau still bau, suggest chemical wash."},
    {"keywords": ["bau hangit", "burning smell", "bau terbakar", "electrical"], "intent": "URGENT_ESCALATE", "answer": "⚠️ Bau terbakar atau electrical smell GAGAL-bot tak boleh diagnose jauh. SWITCH OFF unit sekarang, jangan on-kan lagi. Call technician ASAP."},
    {"keywords": ["aircond buat bunyi", "noisy", "buzzing", "rattling"], "intent": "SYMPTOM_TROUBLESHOOT", "answer": "Bunyi tak normal biasanya dari loose parts atau fan motor problem. Try off dan on balik. Kalau still bunyi, perlu technician check."},
    {"keywords": ["aircond on off", "tripping", "mati sendiri", "power trip"], "intent": "URGENT_ESCALATE", "answer": "⚠️ Aircond yang trip atau buat circuit breaker jatuh GAGAL-bot tak boleh troubleshoot electrical jauh. Call electrician — ini bukan aircond issue, ini wiring issue."},
    {"keywords": ["service aircond", "chemical wash", "service", "Cuci"], "intent": "SERVICE_ENQUIRY", "answer": "Ada 2 jenis service: 1) Normal service (filter clean, coil clean, check gas) — RM80-150. 2) Chemical wash (deep clean, remove kulat/bacteria) — RM150-300. Jarak harga bergantung pada saiz dan kondisi unit."},
    {"keywords": ["gas top up", "refill gas", "gas kurang", "low refrigerant"], "intent": "SERVICE_ENQUIRY", "answer": "Gas top up bukan routine — hanya bila ada leak atau gas rendah confirmed. Kalau aircond still tak sejuk lepas service normal, baru suspect gas. Technician kena check dulu sebelum top up."},
    {"keywords": ["aircond baru", "installation", "pasang aircond baru", "install"], "intent": "SERVICE_ENQUIRY", "answer": "Untuk installation baru, saya perlu tahu: 1) Saiz ruang (kaki persegi)? 2) Budget untuk unit? 3) Lokasi nak pasang? Saya akan bagi quote yang sesuai."},
    {"keywords": ["harga service", "berapa", "price", "cost"], "intent": "PRICE_ENQUIRY", "answer": "Harga bergantung pada: saiz unit (1.0hp/1.5hp/2.0hp), jenis service, dan condition unit. Normal service dari RM80, chemical wash dari RM150. Untuk quote tepat, perlu tahu saiz dan bilangan unit."}
  ]',
  '{
    "normal_service_1hp": "RM80-120",
    "normal_service_1.5hp": "RM100-150",
    "normal_service_2hp": "RM120-180",
    "chemical_wash_1hp": "RM150-200",
    "chemical_wash_1.5hp": "RM180-250",
    "chemical_wash_2hp": "RM220-300",
    "gas_top_up": "RM80-250",
    "installation_1hp": "RM300-500",
    "installation_1.5hp": "RM350-600"
  }',
  '[
    {"objection": "Dah pernah service tapi still tak sejuk", "response": "Service normal tak selalu include gas check. Kalau still tak sejuk lepas service, mungkin ada gas rendah atau masalah lain yang perlu diagnosis lebih mendalam."},
    {"objection": " mahal", "response": "Quality over price. Aircond yang tak servis dengan baik guna lebih elektrik dan rosak lebih cepat. Prevention lebih murah daripada repair."},
    {"objection": "Takde masa", "response": "Saya boleh arrange masa yang sesuai untuk awak. Service biasanya ambil 1-2 jam je."}
  ]',
  1,
  1,
  datetime('now')
);

-- Layer 2: Niche Knowledge - PLUMBING
INSERT OR REPLACE INTO whatsapp_bot_niche_knowledge (id, faq_json, price_ranges_json, objections_json, version, is_active, updated_at)
VALUES (
  'plumbing',
  '[
    {"keywords": ["paip bocor", "leak", "pipes", " bocor"], "intent": "SYMPTOM_TROUBLESHOOT", "answer": "Paip bocor bergantung pada severity. Kalau dripping kecil, boleh tunggu. Kalau flow besar atau ada water damage, kena repair segera."},
    {"keywords": ["sink choke", "drain clogged", "paip tersumbat", "slow drain"], "intent": "SYMPTOM_TROUBLESHOOT", "answer": "Cuba pour air panas atau baking soda + vinegar untuk clear minor choke. Kalau still slow atau choke balik, perlu professional snake."},
    {"keywords": ["toilet choke", "toilet blocked", "bottles", "sumbat"], "intent": "SYMPTOM_TROUBLESHOOT", "answer": "Try plunger dulu. Kalau still blocked, jangan flush lagi — akan overflow. Need professional equipment."},
    {"keywords": ["water heater tak panas", "hot water problem", "heater tak function"], "intent": "SYMPTOM_TROUBLESHOOT", "answer": "Check circuit breaker first. Kalau still tak panas, element atau thermostat problem — perlu electrician/water heater specialist."},
    {"keywords": ["bau busuk dari drain", "smell from drain", "sewer smell"], "intent": "SYMPTOM_TROUBLESHOOT", "answer": "Cuba run water into the drain to refill the P-trap. Kalau smell still ada, mungkin ada deeper issue dalam sewer line."},
    {"keywords": ["water heater leak", "heater bocor", "tangki water heater"], "intent": "URGENT_ESCALATE", "answer": "⚠️ Water heater leak dari tangki body GAGAL-bot tak boleh repair — hanya boleh replace. Switch off water dan power/gas, call technician sekarang."},
    {"keywords": ["gas smell", "bau gas", "gas leak"], "intent": "URGENT_ESCALATE", "answer": "⚠️ BAU GAS = EMERGENCY. Do not operate any switches. Evacuate area. Turn off gas if safe. Call technician/gas company sekarang."},
    {"keywords": ["burst pipe", "paip pecah", "flooding", "banjir"], "intent": "URGENT_ESCALATE", "answer": "⚠️ BURST PIPE = EMERGENCY. Turn off main water valve sekarang! 然后 call plumber segera."},
    {"keywords": ["water pressure rendah", "low pressure", "tekanan air lemah"], "intent": "SYMPTOM_TROUBLESHOOT", "answer": "Check first — kalau hanya satu tap affected, maybe aerator clogged. Kalau whole house, mungkin main supply issue atau leak somewhere."},
    {"keywords": ["bil air tinggi", "water bill high", "usage tak masuk akal"], "intent": "ADVISORY", "answer": "Bil air yang naik mendadak tanpa perubahan usage biasanya tanda ada leak tersembunyi. Sini saya boleh arrange inspection untuk check."}
  ]',
  '{
    "leak_repair_simple": "RM80-150",
    "leak_repair_complex": "RM150-400",
    "drain_snaking": "RM80-200",
    "drain_cctv_inspection": "RM150-300",
    "water_heater_element": "RM100-200",
    "water_heater_thermostat": "RM80-150",
    "toilet_unclog": "RM80-150",
    "pipe_replacement": "RM200-800",
    "emergency_call_out": "RM50-100 extra"
  }',
  '[
    {"objection": "Leak ni kecil je, boleh tunggu", "response": "Leak kecil boleh jadi tanda ada masalah bigger dalam sistem. Lagi lama tinggal, lagi besar potention damage dan bill air naik."},
    {"objection": "Boleh saya repair sendiri", "response": "Untuk minor stuff like replacing washer or aerator, boleh. Tapi untuk anything involving soldering, gas, or main lines, better call professional — safety first."},
    {"objection": "Mahal", "response": "Professional repair dah include warranty. DIY yang gagal boleh jadi lebih mahal bila dah cause water damage."}
  ]',
  1,
  1,
  datetime('now')
);

SELECT 'Seed complete: 2 prompts + 3 niches seeded' AS status;
