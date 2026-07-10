interface Env {
  DEEPSEEK_API_KEY: string;
  DEEPSEEK_PROXY_URL: string;
  META_ACCESS_TOKEN: string;
  META_PHONE_NUMBER_ID: string;
  META_WABA_ID: string;
  META_WEBHOOK_VERIFY_TOKEN: string;
  OWNER_WHATSAPP: string;
  BANK_ACCOUNT_NAME: string;
  BANK_ACCOUNT_NUMBER: string;
  pintarweb_outreach_db: any;
  AI: {
    run(model: string, options: { messages: Array<{ role: string; content: string }>; max_tokens?: number; temperature?: number }): Promise<{ response?: string; content?: string }>;
  };
}

type Intent =
  | 'GREETING'
  | 'FAQ_PACKAGES'
  | 'FAQ_SETUP_FEE'
  | 'FAQ_SUBSCRIBE'
  | 'FAQ_CONTRACT'
  | 'FAQ_TIMELINE'
  | 'FAQ_REQUIREMENTS'
  | 'FAQ_SUPPORT'
  | 'FAQ_OWNERSHIP'
  | 'FAQ_UPDATE'
  | 'FAQ_RENEWAL'
  | 'FAQ_DOMAIN'
  | 'FAQ_WHATSAPP_NUMBER'
  | 'FAQ_LOCAL_SEO'
  | 'FAQ_SATISFACTION'
  | 'FAQ_SEE_BEFORE_LIVE'
  | 'FAQ_PDPA'
  | 'FAQ_PAYMENT_METHODS'
  | 'FAQ_MAINTENANCE'
  | 'FAQ_TECH_SAVVY'
  | 'FAQ_ADD_SERVICES'
  | 'PRICE_ENQUIRY'
  | 'SUBSCRIBE'
  | 'CLOSING_READY'
  | 'HOW_IT_WORKS'
  | 'SUPPORT'
  | 'ESCALATE'
  | 'UNCLEAR';

interface FaqEntry {
  keywords: string[];
  answer: string;
  intent: Intent;
}

const PINTARWEB_FAQ: FaqEntry[] = [
  {
    keywords: ['pakej', 'package', 'included', 'yang saya dapat', 'apa yang saya dapat', 'dapat apa', 'servis apa'],
    intent: 'FAQ_PACKAGES',
    answer: 'Pakej PintarWeb termasuk: website (3-5 page, mobile responsive), WhatsApp auto-reply bot (WABA API), local SEO + Google Business Profile, hosting + SSL, dan sokongan WhatsApp. Semua dalam satu pakej ✅',
  },
  {
    keywords: ['fi persediaan', 'setup fee', 'kenapa bayar', 'bayar untuk apa', 'one-time', 'sebelum'],
    intent: 'FAQ_SETUP_FEE',
    answer: 'Fi persediaan RM297 adalah untuk: daftar domain atas nama bisnes anda, setup hosting + SSL, configure WhatsApp Business API (WABA), dan bina website. Ini kos sekali je, bukan bayaran bulanan.',
  },
  {
    keywords: ['subscribe', 'sign up', 'nak mula', 'cara nak', 'cam mana nak', 'macam mana nak', 'proceed', 'start'],
    intent: 'FAQ_SUBSCRIBE',
    answer: 'LANGGAN 2 STEP: 1️⃣ Bayar RM297 (fi persediaan) → kami bina website. 2️⃣ Dalam 4 minggu, bila site siap, bayar RM149 (activation) → bot dipindahkan ke nombor anda dan site go live! ☎️ Website + bot + SEO siap dalam 4 minggu.',
  },
  {
    keywords: ['kontrak', 'contract', 'cancel', 'batal', 'stop', 'keluar', '30 hari'],
    intent: 'FAQ_CONTRACT',
    answer: 'Kontrak adalah tahunan. nak Batal? Beritahu kami 30 hari sebelum renewal. Tiada penalti atau denda. Setup fee tidak dikembalikan.',
  },
  {
    keywords: ['berapa lama', 'how long', 'lama', 'siap', 'live', 'ready', 'minggu', 'weeks', 'hari'],
    intent: 'FAQ_TIMELINE',
    answer: 'Website siap dalam 4 minggu (28 hari bekerja) dari tarikh anda hantar dokumen dan gambar. Punca kelewatan biasanya lambat hantar dokumen dari pihak pelanggan.',
  },
  {
    keywords: ['apa yang perlu', 'yang saya perlu', 'need from me', 'documents', 'dokumen', 'ssm', 'gambar', 'photo', 'syarat'],
    intent: 'FAQ_REQUIREMENTS',
    answer: 'Yang kami perlu: 1) Dokumen SSM bisnes, 2) Gambar kerja sebenar (10-15 keping, telefon pun boleh), 3) Senarai servis dan harga yang anda tawarkan. Itu je! Kami akan tolong siapkan yang lain.',
  },
  {
    keywords: ['support', 'bantu', 'tolong', 'help', 'masalah', 'issues', 'rosak', 'service'],
    intent: 'FAQ_SUPPORT',
    answer: 'Ya! Sokongan WhatsApp termasuk dalam langganan. Hubungi kami bila-bila masa melalui WhatsApp dan kami akan bantu. Untuk masalah teknikal, response dalam 1-2 jam waktu bekerja.',
  },
  {
    keywords: ['milik', 'own', 'hak', 'property', 'files', 'fail', 'take', 'transfer'],
    intent: 'FAQ_OWNERSHIP',
    answer: 'Website adalah MILIK anda 100%. Domain, fail website, dan semua data adalah atas nama bisnes anda. Kalau nak berpindah ke vendor lain, kami akan serahkan semua fail. Tiada sekatan.',
  },
  {
    keywords: ['update', 'tukar harga', 'ubah', 'edit', 'change', 'sendiri', 'manage'],
    intent: 'FAQ_UPDATE',
    answer: 'Boleh! Anda boleh update harga servis, upload gambar kerja baru, dan tukar teks terus dari telefon melalui WhatsApp. 或 kami tolong tukarkan dalam 24 jam — tak payah buka komputer pun.',
  },
  {
    keywords: ['renewal', 'renew', 'bulanan', 'bulan depan', 'monthly', 'RM149', 'month 4', 'selepas 4 bulan'],
    intent: 'FAQ_RENEWAL',
    answer: 'Selepas 4 bulan, renewal RM149/bulan. Anda boleh pilih: monthly (RM149), quarterly (RM417/3 bulan), 6-bulanan (RM774), atau yearly (RM1,308). Semua include sokongan dan maintenance.',
  },
  {
    keywords: ['domain', 'nama website', 'website name', 'daftar', 'register'],
    intent: 'FAQ_DOMAIN',
    answer: 'Kami yang akan daftar dan uruskan domain atas nama bisnes anda. Anda tak perlu buat apa-apa untuk bahagian ni.',
  },
  {
    keywords: ['whatsapp number', 'nombor whatsapp', 'phone number', 'nombor baru', 'separate'],
    intent: 'FAQ_WHATSAPP_NUMBER',
    answer: 'Kami SARANKAN daftar nombor WhatsApp BARU khas untuk bot (bukan nombor peribadi anda). Ini memastikan mesej bisnes tak bercampur dengan mesej keluarga, dan nombor anda yang lama masih boleh digunakan seperti biasa.',
  },
  {
    keywords: ['seo', 'google', 'maps', 'near me', 'cari google', 'local seo', 'google business'],
    intent: 'FAQ_LOCAL_SEO',
    answer: 'Local SEO ensure bisnes anda appear dalam Google Maps dan "near me" searches. Bila orang taip "aircond service near me" atau "plumber PJ", bisnes anda akan appear dalam Google Maps. Kami setup dan optimize ini semua untuk anda.',
  },
  {
    keywords: ['puas', 'satisfied', 'tak puas', 'revise', 'ubah', 'design', 'ruang'],
    intent: 'FAQ_SATISFACTION',
    answer: 'Kami akan revise design sehingga anda puas hati. Revision adalah sebahagian daripada proses. Dalam 4 minggu tu, kami akan tunjukkan draft dan anda boleh minta ubah sehingga anda happy dengan result.',
  },
  {
    keywords: ['see', 'demo', 'tengok', 'preview', 'sebelum', 'before', 'view'],
    intent: 'FAQ_SEE_BEFORE_LIVE',
    answer: 'Ya! Dalam 4 minggu pembangunan, kami akan hantar link demo untuk anda review. Website tak akan go live sehingga anda bilang okay. Satu langkah dalam masa 4 minggu tu, lepas demo, anda akan nampak semua.',
  },
  {
    keywords: ['pdpa', 'data', 'privacy', 'selamat', 'safe', 'secure', 'selindungi'],
    intent: 'FAQ_PDPA',
    answer: 'Selamat. Kami patuh Akta Perlindungan Data Peribadi (PDPA) Malaysia. Data anda di-encrypt, tidak dikongsi dengan mana-mana pihak ketiga, dan tidak akan digunakan untuk tujuan lain.',
  },
  {
    keywords: ['payment', 'bayar', 'maybank', 'bank', 'duitnow', 'transfer'],
    intent: 'FAQ_PAYMENT_METHODS',
    answer: 'Untuk sekarang, payment via Maybank transfer langsung. Untuk activate dan renew boleh juga guna Maybank transfer. Kami akan share details payment bile masa activate nanti.',
  },
  {
    keywords: ['maintain', 'maintenance', 'selepas', 'after', 'support'],
    intent: 'FAQ_MAINTENANCE',
    answer: 'Maintenance dan sokongan teknikal sudah termasuk dalam langganan bulanan. Kalau ada masalah, WhatsApp kami dan kami akan betulkan. Tidak ada kos tambahan.',
  },
  {
    keywords: ['tech savvy', 'teknikal', 'reti', 'tak reti', 'beginner', 'technically challenged'],
    intent: 'FAQ_TECH_SAVVY',
    answer: 'Tidak masalah! PintarWeb direka untuk orang yang bukan IT. Tak perlu reti coding atau manage website. Semua boleh dilakukan melalui WhatsApp — hantar mesej je, kami yang buat.',
  },
  {
    keywords: ['tambah', 'add more', 'extra', 'servis tambahan', 'page baru', 'new page'],
    intent: 'FAQ_ADD_SERVICES',
    answer: 'Boleh! Tambah page baru, servis baru, atau update apa-apa — just WhatsApp kami dan kami akan tolong. Cost bergantung pada apa yang anda nak tambah.',
  },
];

const PRICING_ANSWER =
  'Harga PintarWeb: RM446 untuk 4 bulan (bayar RM297 fi persediaan + RM149 bulan pertama, dapat 1 bulan PERCUMA). Selepas itu, RM149/bulan. Rincian: Monthly RM149 | Quarterly RM417 | 6-bulan RM774 | Tahunan RM1,308. Nak tahu lebih lanjut tentang pakej?' +
  '\n\nJawab dengan nombor:\n1️⃣ Nak terus mula — saya hantar details payment\n2️⃣ Nak tahu lagi — tanya saya apa-apa yang ragu-ragu';

const CLOSING_READY_ANSWER =
  '🔥 Sedia! Details payment:\n\n' +
  'Bank: Maybank\n' +
  'Akaun: 562021737846 (PintarWeb Enterprise)\n' +
  'Jumlah: RM297 (fi persediaan)\n\n' +
  'Selepas payment, hantar resit dan kami akan mula bina esok. 💪\n\n' +
  'Bila site siap (4 minggu), bayar RM149 untuk activate + 1 bulan percuma unlocked!';

const HOW_IT_WORKS_ANSWER =
  'Proses 4 minggu:\n\n' +
  '📬 Minggu 1: Kami daftar domain + setup akaun WhatsApp API atas nama bisnes anda\n' +
  '🎨 Minggu 2: Design website + setup Google Maps untuk kawasan servis anda\n' +
  '🤖 Minggu 3: Bina website + configure bot WhatsApp\n' +
  '🚀 Minggu 4: Test run, demo kepada anda, dan go LIVE!\n\n' +
  'Kerja anda: serahkan dokumen SSM + gambar kerja. Yang lain, kami yang buat.';

const GREETING_ANSWER =
  'Selamat datang! 👋 Saya pembantu PintarWeb.\n\n' +
  'Saya boleh tolong dengan:\n' +
  '1️⃣ Info pakej dan harga\n' +
  '2️⃣ Cara nak subscribe\n' +
  '3️⃣ Soalan lain tentang servis\n\n' +
  'Apa yang anda nak tahu hari ini?';

function classifyIntent(msg: string): Intent {
  const lower = msg.toLowerCase();

  if (/^(hello|hi|hey|ola|selamat|hy|helo|hallo|apa khabar|apa punya|whassup|apa cakap|khabar apa|ada khabar)\b/i.test(lower)) return 'GREETING';
  if (/okay fine|okay nak|oke ?nak|saya nak subscribe|saya nak subscribe|nak proceed|proceed|saya setuju|i want to|i want this/i.test(lower)) return 'CLOSING_READY';
  if (/^(nak|saya nak|saya mau|i want to subscribe|sign up|start|mari|lets go)/i.test(lower) && /subscribe|signup|langgan/i.test(lower)) return 'CLOSING_READY';
  if (/subscribe|langgan|sign up|nak langgan|nak start|nak proceed/i.test(lower)) return 'SUBSCRIBE';
  if (/marah|saya marah|geram|taik mata|speak to human|human|orang sebenar|talking to person/i.test(lower)) return 'ESCALATE';
  if (/how it works|macam mana|machiavelli|cara how|cara function|process/i.test(lower)) return 'HOW_IT_WORKS';

  if (/price|harga|rm|berapa|cost|fee|duit/i.test(lower)) return 'PRICE_ENQUIRY';

  if (/pakej|package|services yang|i get|apa yang|dapat apa|included/i.test(lower)) return 'FAQ_PACKAGES';
  if (/fi persediaan|setup fee|kenapa.*bayar|bayar.*untuk apa|one.?time/i.test(lower)) return 'FAQ_SETUP_FEE';
  if (/cancel|batal|contract|kontrak|stop|keluar|t\&c|terma/i.test(lower)) return 'FAQ_CONTRACT';
  if (/lama|how long|siap|ready|minggu|weeks|hari|when.*live|berapa masa/i.test(lower)) return 'FAQ_TIMELINE';
  if (/need from me|apa yang perlu|documents|dokumen|ssm|gambar|syarat|photo/i.test(lower)) return 'FAQ_REQUIREMENTS';
  if (/support|tolong|help|masalah|issues|rosak/i.test(lower)) return 'FAQ_SUPPORT';
  if (/own|milik|hak|property|files| fail|take|transfer/i.test(lower)) return 'FAQ_OWNERSHIP';
  if (/update|tukar harga|ubah|edit|change|sendiri|manage/i.test(lower)) return 'FAQ_UPDATE';
  if (/renewal|renew|bulanan|bulan depan|monthly|RM149|month 4|selepas 4/i.test(lower)) return 'FAQ_RENEWAL';
  if (/domain|nama website|website name|daftar|register/i.test(lower)) return 'FAQ_DOMAIN';
  if (/whatsapp number|nombor whatsapp|phone number|nombor baru|separate/i.test(lower)) return 'FAQ_WHATSAPP_NUMBER';
  if (/seo|google|maps|near me|cari google|local seo|google business/i.test(lower)) return 'FAQ_LOCAL_SEO';
  if (/puas|satisfied|tak puas|revise|ubah|design|ruang/i.test(lower)) return 'FAQ_SATISFACTION';
  if (/see|demo|tengok|preview|sebelum|before|view/i.test(lower)) return 'FAQ_SEE_BEFORE_LIVE';
  if (/pdpa|data|privacy|selamat|safe|secure|selindungi/i.test(lower)) return 'FAQ_PDPA';
  if (/payment|bayar|maybank|bank|duitnow|transfer/i.test(lower)) return 'FAQ_PAYMENT_METHODS';
  if (/maintain|maintenance|selepas|after|support/i.test(lower)) return 'FAQ_MAINTENANCE';
  if (/tech savvy|teknikal|reti|tak reti|beginner|technically challenged/i.test(lower)) return 'FAQ_TECH_SAVVY';
  if (/tambah|add more|extra|servis tambahan|page baru|new page/i.test(lower)) return 'FAQ_ADD_SERVICES';

  return 'UNCLEAR';
}

function getFaqAnswer(intent: Intent): string | null {
  const faq = PINTARWEB_FAQ.find((f) => f.intent === intent);
  return faq?.answer ?? null;
}

// ========================================
// D1 Knowledge Base Functions (3-Layer KB)
// ========================================

interface SystemPrompt {
  id: string;
  prompt_type: string;
  prompt_text: string;
  version: number;
  is_active: number;
}

interface NicheKnowledge {
  id: string;
  faq_json: string;
  price_ranges_json: string;
  objections_json: string;
  version: number;
  is_active: number;
}

async function getBasePrompt(db: any, promptType: string = 'base'): Promise<string | null> {
  try {
    const result = await db
      .prepare(
        `SELECT prompt_text FROM whatsapp_bot_system_prompts
         WHERE prompt_type = ? AND is_active = 1
         ORDER BY version DESC LIMIT 1`
      )
      .bind(promptType)
      .first();

    if (result?.prompt_text) {
      return result.prompt_text;
    }
  } catch (err) {
    console.error('[KB] Error reading base prompt from D1:', err);
  }
  return null;
}

async function getNicheKnowledge(db: any, niche: string): Promise<NicheKnowledge | null> {
  try {
    const result = await db
      .prepare(
        `SELECT * FROM whatsapp_bot_niche_knowledge
         WHERE id = ? AND is_active = 1 LIMIT 1`
      )
      .bind(niche)
      .first();

    return result ?? null;
  } catch (err) {
    console.error('[KB] Error reading niche knowledge from D1:', err);
    return null;
  }
}

async function getFaqForNiche(db: any, niche: string): Promise<FaqEntry[]> {
  try {
    const nicheData = await getNicheKnowledge(db, niche);
    if (nicheData?.faq_json) {
      const faqArray = JSON.parse(nicheData.faq_json);
      return faqArray as FaqEntry[];
    }
  } catch (err) {
    console.error('[KB] Error parsing niche FAQ from D1:', err);
  }
  return PINTARWEB_FAQ;
}

async function getPriceRanges(db: any, niche: string): Promise<Record<string, string>> {
  try {
    const nicheData = await getNicheKnowledge(db, niche);
    if (nicheData?.price_ranges_json) {
      return JSON.parse(nicheData.price_ranges_json);
    }
  } catch (err) {
    console.error('[KB] Error reading price ranges from D1:', err);
  }
  return {};
}

async function getObjections(db: any, niche: string): Promise<Array<{ objection: string; response: string }>> {
  try {
    const nicheData = await getNicheKnowledge(db, niche);
    if (nicheData?.objections_json) {
      return JSON.parse(nicheData.objections_json);
    }
  } catch (err) {
    console.error('[KB] Error reading objections from D1:', err);
  }
  return [];
}

async function getClientNiche(db: any, wabaId: string): Promise<string> {
  try {
    const result = await db
      .prepare(`SELECT niche FROM whatsapp_bot_config WHERE waba_id = ?`)
      .bind(wabaId)
      .first();
    return result?.niche ?? 'pintarweb';
  } catch (err) {
    console.error('[KB] Error reading client niche from D1:', err);
    return 'pintarweb';
  }
}

function formatPhone(phone: string): string {
  let num = phone.replace(/\D/g, '');
  if (num.startsWith('60')) return num;
  if (num.startsWith('0')) return '6' + num;
  return num;
}

async function sendWhatsAppMessage(
  token: string,
  phoneNumberId: string,
  recipientPhone: string,
  message: string
): Promise<void> {
  const formatted = formatPhone(recipientPhone);
  const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: formatted,
      type: 'text',
      text: { body: message },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to send WhatsApp message:', error);
    throw new Error(`WhatsApp API error: ${response.status} ${error}`);
  }
}

async function getClientConfig(
  db: any,
  wabaId: string
): Promise<{
  business_name: string;
  services: string;
  price_display: string;
  area: string;
  owner_notification: string;
} | null> {
  const result = await db
    .prepare(
      `SELECT business_name, services, price_display, area, owner_notification
       FROM whatsapp_bot_config WHERE waba_id = ?`
    )
    .bind(wabaId)
    .first();

  return result ?? null;
}

async function markGreetingSent(
  db: any,
  wabaId: string,
  customerPhone: string
): Promise<void> {
  await db
    .prepare(
      `INSERT OR REPLACE INTO whatsapp_bot_greetings (waba_id, customer_phone, sent_at)
       VALUES (?, ?, datetime('now'))`
    )
    .bind(wabaId, customerPhone)
    .run();
}

async function wasGreetingSent(
  db: any,
  wabaId: string,
  customerPhone: string
): Promise<boolean> {
  const result = await db
    .prepare(
      `SELECT 1 FROM whatsapp_bot_greetings WHERE waba_id = ? AND customer_phone = ?`
    )
    .bind(wabaId, customerPhone)
    .first();
  return result !== null;
}

async function storeMessage(
  db: any,
  wabaId: string,
  customerPhone: string,
  role: 'customer' | 'assistant',
  message: string
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO whatsapp_bot_conversations (waba_id, customer_phone, role, message, created_at)
       VALUES (?, ?, ?, ?, datetime('now'))`
    )
    .bind(wabaId, customerPhone, role, message)
    .run();

  await db
    .prepare(
      `DELETE FROM whatsapp_bot_conversations
       WHERE waba_id = ? AND customer_phone = ?
       AND id NOT IN (
         SELECT id FROM whatsapp_bot_conversations
         WHERE waba_id = ? AND customer_phone = ?
         ORDER BY created_at DESC LIMIT 10
       )`
    )
    .bind(wabaId, customerPhone, wabaId, customerPhone)
    .run();
}

async function getConversationHistory(
  db: any,
  wabaId: string,
  customerPhone: string
): Promise<Array<{ role: string; content: string }>> {
  const result = await db
    .prepare(
      `SELECT role, message FROM whatsapp_bot_conversations
       WHERE waba_id = ? AND customer_phone = ?
       ORDER BY created_at ASC
       LIMIT 10`
    )
    .bind(wabaId, customerPhone)
    .all();

  return (result.results || []).map((row: any) => ({
    role: row.role,
    content: row.message,
  }));
}

async function generateAIResponse(
  apiKey: string,
  businessName: string,
  area: string,
  customerMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  db: any,
  wabaId: string
): Promise<string> {
  let systemPrompt = await getBasePrompt(db, 'base');

  if (!systemPrompt) {
    systemPrompt = `You are a receptionist for "${businessName}" in ${area}. You reply to WhatsApp messages from CUSTOMERS.

IMPORTANT RULES — FOLLOW EXACTLY:
1. CRITICAL: Always reply in Malaysian Bahasa Melayu. NEVER use Indonesian words like "emitkan" (use "hantar"), "tersebut", "para". NEVER mix Chinese or other language characters into your reply. NEVER use broken grammar like "saya akan told you team" or "forwarded mensaje".
2. Reply in the SAME language the customer used. Malay → Malay, English → English, Manglish → Manglish.
3. Reply must be 1-2 short sentences MAXIMUM. Never write more.
4. Answer the SPECIFIC question asked. Do not add generic follow-ups like "nak tahu lagi apa-apa, WhatsApp je".
5. NEVER say "terima kasih", "thank you", "you're welcome" as your main or only reply.
6. NEVER refer to yourself as "I" or "we". You ARE the business. Say "kami" sparingly.
7. NEVER mention AI, bots, automated systems, or that you're a computer.
8. NEVER make up information not provided above.
9. If you don't know the answer, say "Saya akan tanya team dan-balik pada anda."
10. Do NOT offer to send links, forms, or anything you can't actually send.
11. Keep every reply SHORT and CONVERSATIONAL — like chatting with a helpful friend who happens to know the business.`;
  }

  const recentHistory = conversationHistory.slice(-4);

  const messages: Array<{ role: string; content: string }> = [
    { role: 'system', content: systemPrompt },
    ...recentHistory,
    { role: 'user', content: customerMessage },
  ];

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat-v4-20250615',
        messages,
        temperature: 0.3,
        max_tokens: 120,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[WA Bot] DeepSeek error:', error);
      return 'Hmm, saya akan tanya team tentang tu dan-balik pada anda tidak lama. 💬';
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (reply) return reply;
    return 'Hmm, saya akan tanya team tentang tu dan-balik pada anda tidak lama. 💬';
  } catch (err) {
    console.error('[WA Bot] DeepSeek exception:', err);
    return 'Hmm, saya akan tanya team tentang tu dan-balik pada anda tidak lama. 💬';
  }
}

async function notifyOwner(
  token: string,
  phoneNumberId: string,
  ownerWhatsApp: string,
  customerName: string,
  customerPhone: string,
  message: string,
  intent: string,
  businessName: string
): Promise<void> {
  const formattedOwner = formatPhone(ownerWhatsApp);

  const intentLabel: Record<string, string> = {
    GREETING: '👋 First contact',
    FAQ_PACKAGES: '📦 Pakej/Harga',
    FAQ_SUBSCRIBE: '📋 Subscribe',
    CLOSING_READY: '🔥🔥🔥 READY TO PAY!!!',
    SUBSCRIBE: '📋 Nak subscribe',
    PRICE_ENQUIRY: '💰 Price enquiry',
    HOW_IT_WORKS: '🔧 How it works',
    FAQ_TIMELINE: '⏱️ Timeline',
    ESCALATE: '⚠️ ESCALATE',
    SUPPORT: '🆘 Support',
    UNCLEAR: '❓ Unclear',
  };

  const label = intentLabel[intent] ?? intent;
  const notification = `🔔 LEAD — ${label}

📱 Pelanggan: ${customerName}
📞 Nombor: ${customerPhone}
💬 Mesej: "${message}"

--
Balas: wa.me/${customerPhone.replace(/\D/g, '')}`;

  const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

  await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: formattedOwner,
      type: 'text',
      text: { body: notification },
    }),
  });
}

function handleIntent(
  intent: Intent,
  customerName: string,
  businessName: string
): string {
  switch (intent) {
    case 'GREETING':
      return GREETING_ANSWER;

    case 'FAQ_PACKAGES':
    case 'FAQ_SETUP_FEE':
    case 'FAQ_CONTRACT':
    case 'FAQ_TIMELINE':
    case 'FAQ_REQUIREMENTS':
    case 'FAQ_SUPPORT':
    case 'FAQ_OWNERSHIP':
    case 'FAQ_UPDATE':
    case 'FAQ_RENEWAL':
    case 'FAQ_DOMAIN':
    case 'FAQ_WHATSAPP_NUMBER':
    case 'FAQ_LOCAL_SEO':
    case 'FAQ_SATISFACTION':
    case 'FAQ_SEE_BEFORE_LIVE':
    case 'FAQ_PDPA':
    case 'FAQ_PAYMENT_METHODS':
    case 'FAQ_MAINTENANCE':
    case 'FAQ_TECH_SAVVY':
    case 'FAQ_ADD_SERVICES': {
      const answer = getFaqAnswer(intent);
      if (answer) return answer + '\n\nAda lagi yang nak tahu?';
      return 'Ada lagi yang nak tahu? 💬';
    }

    case 'PRICE_ENQUIRY':
      return PRICING_ANSWER;

    case 'SUBSCRIBE':
      return (
        'Nak start dengan PintarWeb? Sedia!\n\n' +
        'Jawab dengan nombor:\n' +
        '1️⃣ Saya nak terus mula — saya hantar details payment\n' +
        '2️⃣ Saya nak tahu lagi — apa yang ragu-ragu?'
      );

    case 'CLOSING_READY':
      return CLOSING_READY_ANSWER;

    case 'HOW_IT_WORKS':
      return HOW_IT_WORKS_ANSWER;

    case 'SUPPORT':
      return (
        'Okay, saya akan forward ini ke team kami. Mereka akan hubungi anda tidak lama. 💬\n\n' +
        'Untuk respons yang lebih cepat, anda boleh WhatsApp kami terus: +60196556243'
      );

    case 'ESCALATE':
      return (
        'Okay, saya akan forward ini ke team kami. Mereka akan hubungi anda tidak lama. 💬\n\n' +
        'Untuk respons yang lebih cepat, anda boleh WhatsApp kami terus: +60196556243'
      );

    case 'UNCLEAR':
      return (
        'Maaf, saya tak pasti faham dengan tepat. 💬\n\n' +
        'Boleh explain lagi apa yang anda nak? Contoh:\n' +
        '- "Harga berapa?"\n' +
        '- "Nak subscribe macam mana?"\n' +
        '- "Berapa lama nak siap?"'
      );

    default:
      return 'Ada lagi yang nak tahu? 💬';
  }
}

async function storePendingRequest(
  db: any,
  id: string,
  wabaId: string,
  phoneNumberId: string,
  customerPhone: string,
  messageId: string,
  prompt: string
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO whatsapp_bot_pending_llm_requests
       (id, waba_id, phone_number_id, customer_phone, message_id, prompt, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`
    )
    .bind(id, wabaId, phoneNumberId, customerPhone, messageId, prompt)
    .run();
}

async function updatePendingRequest(
  db: any,
  id: string,
  status: string,
  errorMessage?: string
): Promise<void> {
  await db
    .prepare(
      `UPDATE whatsapp_bot_pending_llm_requests
       SET status = ?, error_message = ?, completed_at = datetime('now')
       WHERE id = ?`
    )
    .bind(status, errorMessage ?? null, id)
    .run();
}

const AI_MODEL = '@cf/meta/llama-3.2-3b-instruct';

async function sendPendingLlmRequest(
  env: Env,
  wabaId: string,
  phoneNumberId: string,
  customerPhone: string,
  customerName: string,
  messageId: string,
  intent: string,
  businessName: string,
  area: string,
  customerMessage: string,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<void> {
  await notifyOwner(
    env.META_ACCESS_TOKEN,
    phoneNumberId,
    '60174456243',
    customerName,
    customerPhone,
    customerMessage,
    intent,
    businessName
  );
  const requestId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  let systemPrompt = await getBasePrompt(env.pintarweb_outreach_db, 'base');
  if (!systemPrompt) {
    systemPrompt = `You are a receptionist for "${businessName}" in ${area}. You reply to WhatsApp messages from CUSTOMERS.

IMPORTANT RULES — FOLLOW EXACTLY:
1. CRITICAL: Always reply in Malaysian Bahasa Melayu. NEVER use Indonesian words like "emitkan" (use "hantar"), "tersebut", "para". NEVER mix Chinese or other language characters into your reply. NEVER use broken grammar like "saya akan told you team" or "forwarded mensaje".
2. Reply in the SAME language the customer used. Malay → Malay, English → English, Manglish → Manglish.
3. Reply must be 1-2 short sentences MAXIMUM. Never write more.
4. Answer the SPECIFIC question asked. Do not add generic follow-ups like "nak tahu lagi apa-apa, WhatsApp je".
5. NEVER say "terima kasih", "thank you", "you're welcome" as your main or only reply.
6. NEVER refer to yourself as "I" or "we". You ARE the business. Say "kami" sparingly.
7. NEVER mention AI, bots, automated systems, or that you're a computer.
8. NEVER make up information not provided above.
9. If you don't know the answer, say "Saya akan tanya team dan-balik pada anda."
10. Do NOT offer to send links, forms, or anything you can't actually send.
11. Keep every reply SHORT and CONVERSATIONAL — like chatting with a helpful friend who happens to know the business.`;
  }

  const recentHistory = conversationHistory.slice(-4);
  const messages = [
    { role: 'system', content: systemPrompt },
    ...recentHistory,
    { role: 'user', content: customerMessage },
  ];

  const promptText = JSON.stringify({ model: 'deepseek-chat', messages, temperature: 0.3, max_tokens: 500 });

  await storePendingRequest(env.pintarweb_outreach_db, requestId, wabaId, phoneNumberId, customerPhone, messageId, promptText);

  let reply: string | null = null;
  let errorMsg: string | null = null;

  try {
    console.log(`[WA Bot] Calling Workers AI (${AI_MODEL}) for ${requestId}...`);
    const result: any = await env.AI.run(AI_MODEL, {
      messages,
      max_tokens: 500,
      temperature: 0.3,
    });
    reply = result.response || result.content || null;
    if (reply) {
      console.log(`[WA Bot] Workers AI reply for ${requestId}: ${reply.substring(0, 60)}`);
    }
  } catch (err) {
    errorMsg = `[Workers AI] ${err instanceof Error ? err.message : String(err)}`;
    console.error(`[WA Bot] Workers AI failed for ${requestId}:`, err);
  }

  if (!reply && env.DEEPSEEK_PROXY_URL) {
    try {
      console.log(`[WA Bot] Falling back to DeepSeek proxy for ${requestId}...`);
      const response = await fetch(env.DEEPSEEK_PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: promptText,
      });

      if (!response.ok) {
        const error = await response.text();
        errorMsg = `[Proxy] ${response.status}: ${error}`;
        console.error(`[WA Bot] Proxy error for ${requestId}:`, error);
      } else {
        const data = await response.json();
        reply = data.choices?.[0]?.message?.content?.trim() || null;
        if (reply) {
          console.log(`[WA Bot] Proxy fallback reply for ${requestId}: ${reply.substring(0, 60)}`);
        }
      }
    } catch (err) {
      errorMsg = `[Proxy] ${err instanceof Error ? err.message : String(err)}`;
      console.error(`[WA Bot] Proxy fallback failed for ${requestId}:`, err);
    }
  }

  if (!reply) {
    console.error(`[WA Bot] All LLM backends failed for ${requestId}: ${errorMsg}`);
    await updatePendingRequest(env.pintarweb_outreach_db, requestId, 'failed', errorMsg || 'Unknown error');
    return;
  }

  await sendWhatsAppMessage(env.META_ACCESS_TOKEN, phoneNumberId, customerPhone, reply);
  await storeMessage(env.pintarweb_outreach_db, wabaId, customerPhone, 'assistant', reply);
  await updatePendingRequest(env.pintarweb_outreach_db, requestId, 'completed');
  console.log(`[WA Bot] LLM reply sent for ${requestId}`);
}

async function handleIncomingMessage(
  env: Env,
  ctx: any,
  phoneNumberId: string,
  wabaId: string,
  customerPhone: string,
  customerName: string,
  messageText: string
): Promise<void> {
  try {
    const config = await getClientConfig(env.pintarweb_outreach_db, wabaId);

    if (!config) {
      console.error(`[WA Bot] No config for WABA: ${wabaId}`);
      return;
    }

    await storeMessage(env.pintarweb_outreach_db, wabaId, customerPhone, 'customer', messageText);

    const alreadyGreeted = await wasGreetingSent(
      env.pintarweb_outreach_db,
      wabaId,
      customerPhone
    );

    const intent = classifyIntent(messageText);
    console.log(`[WA Bot] intent=${intent} greeted=${alreadyGreeted} phone=${customerPhone}`);

    if (!alreadyGreeted) {
      const reply = GREETING_ANSWER.replace('Selamat datang! 👋 Saya pembantu PintarWeb.', `Hi ${customerName}! Selamat datang! 👋 Saya pembantu ${config.business_name}.`);
      await sendWhatsAppMessage(env.META_ACCESS_TOKEN, phoneNumberId, customerPhone, reply);
      await storeMessage(env.pintarweb_outreach_db, wabaId, customerPhone, 'assistant', reply);
      await markGreetingSent(env.pintarweb_outreach_db, wabaId, customerPhone);
      console.log(`[WA Bot] Sent greeting to ${customerPhone}`);
      return;
    }

    const needsLLM = (intent === 'UNCLEAR' || intent === 'GREETING');

    if (needsLLM) {
      const conversationHistory = await getConversationHistory(
        env.pintarweb_outreach_db,
        wabaId,
        customerPhone
      );

      if (conversationHistory.length > 0) {
        const simpleGreetings = ['apa khabar', 'khabar apa', 'ada khabar', 'selamat pagi', 'selamat malam', 'selamat petang', 'good morning', 'good night', 'good afternoon'];
        const isSimpleGreeting = simpleGreetings.some(g => messageText.toLowerCase().includes(g)) && messageText.length < 30;

        if (isSimpleGreeting) {
          const greetingReply = 'Hola! Saya di sini. Nak tanya apa-apa tentang PintarWeb? 😄';
          await sendWhatsAppMessage(env.META_ACCESS_TOKEN, phoneNumberId, customerPhone, greetingReply);
          await storeMessage(env.pintarweb_outreach_db, wabaId, customerPhone, 'assistant', greetingReply);
        } else {
          const deferReply = 'Hmm, saya akan tanya team dulu. Saya hubungi awak tidak lama lagi. 💬';
          await sendWhatsAppMessage(env.META_ACCESS_TOKEN, phoneNumberId, customerPhone, deferReply);
          await storeMessage(env.pintarweb_outreach_db, wabaId, customerPhone, 'assistant', deferReply);
        }

        await notifyOwner(
          env.META_ACCESS_TOKEN,
          phoneNumberId,
          config.owner_notification,
          customerName,
          customerPhone,
          messageText,
          intent,
          config.business_name
        );
        return;
      }
    }

    const reply = handleIntent(intent, customerName, config.business_name);
    console.log(`[WA Bot] handleIntent gave: ${reply.substring(0, 80)}`);

    await notifyOwner(
      env.META_ACCESS_TOKEN,
      phoneNumberId,
      config.owner_notification,
      customerName,
      customerPhone,
      messageText,
      intent,
      config.business_name
    );

    await sendWhatsAppMessage(env.META_ACCESS_TOKEN, phoneNumberId, customerPhone, reply);
    await storeMessage(env.pintarweb_outreach_db, wabaId, customerPhone, 'assistant', reply);
  } catch (err) {
    console.error('[WA Bot] handleIncomingMessage error:', err);
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'GET' && url.pathname === '/webhook') {
      const mode = url.searchParams.get('hub.mode');
      const token = url.searchParams.get('hub.verify_token');
      const challenge = url.searchParams.get('hub.challenge');

      if (mode === 'subscribe' && token === env.META_WEBHOOK_VERIFY_TOKEN) {
        return new Response(challenge, { status: 200 });
      }
      return new Response('Verification failed', { status: 403 });
    }

    if (request.method === 'POST' && url.pathname === '/webhook') {
      try {
        const body = await request.json();
        if (body.object !== 'whatsapp_business_account') {
          return new Response('OK', { status: 200 });
        }

        const messages = body.entry?.[0]?.changes?.[0]?.value?.messages;
        if (!messages || messages.length === 0) {
          return new Response('OK', { status: 200 });
        }

        const phoneNumberId = body.entry[0].changes[0].value.metadata.phone_number_id;
        const wabaId = body.entry[0].id;
        const msg = messages[0];

        if (msg.type !== 'text' || !msg.text?.body) {
          return new Response('OK', { status: 200 });
        }

        const customerPhone = msg.from;
        const customerName =
          body.entry[0].changes[0].value.contacts?.[0]?.profile?.name ?? 'Pelanggan';
        const messageText = msg.text.body.trim();

        console.log(`[WA Bot] Message from ${customerPhone}: ${messageText}`);

        await handleIncomingMessage(env, ctx, phoneNumberId, wabaId, customerPhone, customerName, messageText);

        return new Response('OK', { status: 200 });
      } catch (err) {
        console.error('[WA Bot] Webhook error:', err);
        return new Response('OK', { status: 200 });
      }
    }

    if (request.method === 'GET' && url.pathname === '/health') {
      return new Response(
        JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response('Not found', { status: 404 });
  },
};
