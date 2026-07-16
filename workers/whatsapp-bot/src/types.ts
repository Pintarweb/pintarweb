export interface Env {
  DEEPSEEK_API_KEY: string;
  DEEPSEEK_PROXY_URL: string;
  META_ACCESS_TOKEN: string;
  META_PHONE_NUMBER_ID: string;
  META_WABA_ID: string;
  META_WEBHOOK_VERIFY_TOKEN: string;
  OWNER_WHATSAPP: string;
  BANK_ACCOUNT_NAME: string;
  BANK_ACCOUNT_NUMBER: string;
  ANTHROPIC_API_KEY: string;
  ADMIN_SECRET: string;
  pintarweb_outreach_db: any;
  AI: {
    run(model: string, options: { messages: Array<{ role: string; content: string }>; max_tokens?: number; temperature?: number }): Promise<{ response?: string; content: string }>;
  };
}

export type Intent =
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

export interface FaqEntry {
  keywords: string[];
  answer: string;
  intent: Intent;
}

export interface TenantWabaAccount {
  id: string;
  waba_id: string;
  phone_number_id: string;
  phone_number: string;
  access_token: string;
  business_account_id: string | null;
  display_name: string;
  is_default: number;
  status: string;
}

export interface TenantContext {
  clientId: string;
  companyName: string;
  subscriptionStatus: string;
  subscriptionTier: string;
  ownerName: string | null;
  ownerPhone: string;
  features: Record<string, string | null>;
  niche: string;
  area: string;
  services: string;
  priceDisplay: string;
  businessHours: string | null;
  closingFlowEnabled: boolean;
  wabaAccount: TenantWabaAccount;
  wabaId: string;
  phoneNumberId: string;
}

export interface SystemPrompt {
  id: string;
  prompt_type: string;
  prompt_text: string;
  version: number;
  is_active: number;
}

export interface NicheKnowledge {
  id: string;
  faq_json: string;
  price_ranges_json: string;
  objections_json: string;
  version: number;
  is_active: number;
}

export interface SuggestionDef {
  questions: [string, string];
  onSelect: [Intent, Intent];
}

export const PINTARWEB_FAQ: FaqEntry[] = [
  { keywords: ['pakej', 'package', 'included', 'yang saya dapat', 'apa yang saya dapat', 'dapat apa', 'servis apa'], intent: 'FAQ_PACKAGES', answer: 'Website 3-5 muka surat (mobile responsive), WhatsApp auto-reply bot, Google Business Profile, hosting + SSL. Semua sekali.' },
  { keywords: ['fi persediaan', 'setup fee', 'kenapa bayar', 'bayar untuk apa', 'one-time', 'sebelum'], intent: 'FAQ_SETUP_FEE', answer: 'RM297 untuk daftar domain atas nama anda, hosting, SSL, dan bina website. Bayar sekali je, bukan bulanan.' },
  { keywords: ['subscribe', 'sign up', 'nak mula', 'cara nak', 'cam mana nak', 'macam mana nak', 'proceed', 'start'], intent: 'FAQ_SUBSCRIBE', answer: 'Step 1: Bayar RM297 → kami bina. Step 2: 4 minggu, site siap, bayar RM149 → go live!' },
  { keywords: ['kontrak', 'contract', 'cancel', 'batal', 'stop', 'keluar', '30 hari'], intent: 'FAQ_CONTRACT', answer: 'Tiada kontrak. Boleh berhenti bila-bila, cuma notify 14 hari awal.' },
  { keywords: ['berapa lama', 'how long', 'lama', 'siap', 'live', 'ready', 'minggu', 'weeks', 'hari'], intent: 'FAQ_TIMELINE', answer: '4 minggu dari tarikh anda hantar dokumen. Selalunya lambat sebab dokumen lambat sampai.' },
  { keywords: ['apa yang perlu', 'yang saya perlu', 'need from me', 'documents', 'dokumen', 'ssm', 'gambar', 'photo', 'syarat'], intent: 'FAQ_REQUIREMENTS', answer: 'SSM, gambar kerja (10-15 keping, guna telefon pun ok), senarai servis + harga. Kami uruskan yang lain.' },
  { keywords: ['support', 'bantu', 'tolong', 'help', 'masalah', 'issues', 'rosak', 'service'], intent: 'FAQ_SUPPORT', answer: 'Sokongan WhatsApp included. Hubungi kami, response 1-2 jam waktu kerja.' },
  { keywords: ['milik', 'own', 'hak', 'property', 'files', 'fail', 'take', 'transfer'], intent: 'FAQ_OWNERSHIP', answer: 'Website 100% milik anda. Domain, fail, data semua atas nama bisnes anda. Nak pindah? Kami serahkan semua.' },
  { keywords: ['update', 'tukar harga', 'ubah', 'edit', 'change', 'sendiri', 'manage'], intent: 'FAQ_UPDATE', answer: 'Boleh update sendiri guna WhatsApp, atau minta kami tolong — siap 24 jam.' },
  { keywords: ['renewal', 'renew', 'bulanan', 'bulan depan', 'monthly', 'RM149', 'month 2', 'selepas 2 bulan', 'selepas bulan ke-2'], intent: 'FAQ_RENEWAL', answer: 'Renewal bermula bulan ke-3: RM149/bulan. Pilihan: monthly RM149, quarterly RM417, 6-bulan RM774, yearly RM1,308. Tiada kontrak.' },
  { keywords: ['domain', 'nama website', 'website name', 'daftar', 'register'], intent: 'FAQ_DOMAIN', answer: 'Kami uruskan domain atas nama bisnes anda. Anda tak perlu buat apa-apa.' },
  { keywords: ['whatsapp number', 'nombor whatsapp', 'phone number', 'nombor baru', 'separate'], intent: 'FAQ_WHATSAPP_NUMBER', answer: 'Guna nombor WhatsApp baru khas untuk bot. Elak mesej bisnes bercampur personal.' },
  { keywords: ['seo', 'google', 'maps', 'near me', 'cari google', 'local seo', 'google business'], intent: 'FAQ_LOCAL_SEO', answer: 'Local SEO buat bisnes anda muncul dalam Google Maps bila orang cari "near me". Kami setup semua.' },
  { keywords: ['puas', 'satisfied', 'tak puas', 'revise', 'ubah', 'design', 'ruang'], intent: 'FAQ_SATISFACTION', answer: 'Kami revise sampai anda puas. Dalam 4 minggu, kami tunjuk draft, anda minta ubah — ulang sampai happy.' },
  { keywords: ['see', 'demo', 'tengok', 'preview', 'sebelum', 'before', 'view'], intent: 'FAQ_SEE_BEFORE_LIVE', answer: 'Kami hantar link demo untuk review. Website tak go live sampai anda kata okay.' },
  { keywords: ['pdpa', 'data', 'privacy', 'selamat', 'safe', 'secure', 'selindungi'], intent: 'FAQ_PDPA', answer: 'Selamat. Kami patuh PDPA Malaysia. Data di-encrypt, tak dikongsi dengan pihak ketiga.' },
  { keywords: ['payment', 'bayar', 'maybank', 'bank', 'duitnow', 'transfer'], intent: 'FAQ_PAYMENT_METHODS', answer: 'Maybank transfer terus. Kami share details bila masa activate.' },
  { keywords: ['maintain', 'maintenance', 'selepas', 'after', 'support'], intent: 'FAQ_MAINTENANCE', answer: 'Maintenance dah included. Ada masalah? WhatsApp kami, kami betulkan. Tiada kos tambahan.' },
  { keywords: ['tech savvy', 'teknikal', 'reti', 'tak reti', 'beginner', 'technically challenged'], intent: 'FAQ_TECH_SAVVY', answer: 'Tak perlu reti coding. Semua guna WhatsApp — hantar mesej je, kami uruskan.' },
  { keywords: ['tambah', 'add more', 'extra', 'servis tambahan', 'page baru', 'new page'], intent: 'FAQ_ADD_SERVICES', answer: 'Boleh tambah page, servis, atau update apa-apa — WhatsApp je. Cost ikut apa yang nak tambah.' },
];

export const SUGGESTION_MAP: Partial<Record<Intent, SuggestionDef>> = {
  FAQ_PACKAGES: { questions: ['Berapakah harga?', 'Berapa lama nak siap?'], onSelect: ['PRICE_ENQUIRY', 'FAQ_TIMELINE'] },
  FAQ_SETUP_FEE: { questions: ['Apa yang saya dapat?', 'Ok nak start sekarang!'], onSelect: ['FAQ_PACKAGES', 'SUBSCRIBE'] },
  FAQ_CONTRACT: { questions: ['Berapa harga sebulan?', 'Apa servis termasuk?'], onSelect: ['PRICE_ENQUIRY', 'FAQ_PACKAGES'] },
  FAQ_TIMELINE: { questions: ['Apa yang perlu saya prepare?', 'Saya nak start!'], onSelect: ['FAQ_REQUIREMENTS', 'SUBSCRIBE'] },
  FAQ_REQUIREMENTS: { questions: ['Berapa lama proses ni?', 'Saya nak start!'], onSelect: ['FAQ_TIMELINE', 'SUBSCRIBE'] },
  FAQ_SUPPORT: { questions: ['Ada servis lain?', 'Berapa harga pakej?'], onSelect: ['FAQ_PACKAGES', 'PRICE_ENQUIRY'] },
  FAQ_OWNERSHIP: { questions: ['Kalau nak update boleh?', 'Berapa harga sebulan?'], onSelect: ['FAQ_UPDATE', 'PRICE_ENQUIRY'] },
  FAQ_UPDATE: { questions: ['Servis lengkap ada?', 'Nak start macam mana?'], onSelect: ['FAQ_PACKAGES', 'SUBSCRIBE'] },
  FAQ_RENEWAL: { questions: ['Apa dapat dengan RM149?', 'Nak subscribe macam mana?'], onSelect: ['FAQ_PACKAGES', 'SUBSCRIBE'] },
  FAQ_DOMAIN: { questions: ['Website termasuk apa?', 'Berapa harga sebulan?'], onSelect: ['FAQ_PACKAGES', 'PRICE_ENQUIRY'] },
  FAQ_WHATSAPP_NUMBER: { questions: ['Apa include dalam pakej?', 'Bila boleh start?'], onSelect: ['FAQ_PACKAGES', 'HOW_IT_WORKS'] },
  FAQ_LOCAL_SEO: { questions: ['Website design macam mana?', 'Berapa lama nak siap?'], onSelect: ['FAQ_PACKAGES', 'FAQ_TIMELINE'] },
  FAQ_SATISFACTION: { questions: ['Berapa harga total?', 'Macam mana nak mula?'], onSelect: ['PRICE_ENQUIRY', 'SUBSCRIBE'] },
  FAQ_SEE_BEFORE_LIVE: { questions: ['Kalau ada ubah, lewat ke?', 'Nak start sekarang!'], onSelect: ['FAQ_TIMELINE', 'SUBSCRIBE'] },
  FAQ_PDPA: { questions: ['Apa yang saya dapat?', 'Berapa harga?'], onSelect: ['FAQ_PACKAGES', 'PRICE_ENQUIRY'] },
  FAQ_PAYMENT_METHODS: { questions: ['Selamat ke payment macam ni?', 'Ada hidden cost?'], onSelect: ['FAQ_PDPA', 'FAQ_PACKAGES'] },
  FAQ_MAINTENANCE: { questions: ['Ada servis tambahan?', 'Nak subscribe macam mana?'], onSelect: ['FAQ_ADD_SERVICES', 'SUBSCRIBE'] },
  FAQ_TECH_SAVVY: { questions: ['Kalau nak mula, apa kena buat?', 'Berapa lama nak siap?'], onSelect: ['FAQ_REQUIREMENTS', 'FAQ_TIMELINE'] },
  FAQ_ADD_SERVICES: { questions: ['Berapa harga tambahan?', 'Nak start dengan basic dulu?'], onSelect: ['PRICE_ENQUIRY', 'SUBSCRIBE'] },
  HOW_IT_WORKS: { questions: ['Berapa harga total?', 'Apa yang saya perlu prepare?'], onSelect: ['PRICE_ENQUIRY', 'FAQ_REQUIREMENTS'] },
  SUPPORT: { questions: ['Nak mula dengan PintarWeb?', 'Berapa harganya?'], onSelect: ['SUBSCRIBE', 'PRICE_ENQUIRY'] },
  UNCLEAR: { questions: ['Berapakah harga?', 'Macam mana nak mula?'], onSelect: ['PRICE_ENQUIRY', 'SUBSCRIBE'] },
};

export const PRICING_ANSWER =
  'Harga PintarWeb: RM446 total (RM297 setup + RM149 activation). Activation + bulan pertama RM149 — dapat 1 bulan PERCUMA. Renewal bulan ke-3: RM149/bulan. Tiada kontrak.' +
  '\n\nJawab dengan nombor:\n1️⃣ Nak terus mula — saya hantar details payment\n2️⃣ Nak tahu lagi — tanya saya apa-apa yang ragu-ragu';

export const CLOSING_READY_ANSWER =
  '🔥 Sedia! Details payment:\n\nBank: Maybank\nAkaun: 562021737846 (PintarWeb Enterprise)\nJumlah: RM297 (fi persediaan)\n\nSelepas payment, hantar resit dan kami akan mula bina esok. 💪\n\nBila site siap (4 minggu), bayar RM149 untuk activate + 1 bulan percuma unlocked!';

export const HOW_IT_WORKS_ANSWER =
  'Proses 4 minggu:\n\n📬 Minggu 1: Kami daftar domain + setup akaun WhatsApp API atas nama bisnes anda\n🎨 Minggu 2: Design website + setup Google Maps untuk kawasan servis anda\n🤖 Minggu 3: Bina website + configure bot WhatsApp\n🚀 Minggu 4: Test run, demo kepada anda, dan go LIVE!\n\nKerja anda: serahkan dokumen SSM + gambar kerja. Yang lain, kami yang buat.';

export const GREETING_ANSWER =
  'Selamat datang! 👋 Saya pembantu PintarWeb.\n\n' +
  'Saya boleh tolong dengan:\n' +
  '1️⃣ Info pakej dan harga\n' +
  '2️⃣ Cara nak subscribe\n' +
  '3️⃣ Soalan lain tentang servis\n\n' +
  'Apa yang anda nak tahu hari ini?';
