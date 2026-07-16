import type { Env, Intent, TenantContext, SuggestionDef } from './types';
import { PINTARWEB_FAQ, SUGGESTION_MAP, GREETING_ANSWER, PRICING_ANSWER, CLOSING_READY_ANSWER, HOW_IT_WORKS_ANSWER } from './types';
import { sendWhatsAppMessage, storeMessage, getConversationHistory, wasGreetingSent, markGreetingSent, notifyOwner } from './kb';

const CLAUDE_MODEL = 'claude-haiku-4-5-20251001';

export function classifyIntent(msg: string): Intent {
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

export function getFaqAnswer(intent: Intent): string | null {
  const faq = PINTARWEB_FAQ.find((f) => f.intent === intent);
  return faq?.answer ?? null;
}

export function getSuggestions(intent: Intent): SuggestionDef | null {
  return SUGGESTION_MAP[intent] ?? null;
}

export function intentHasSuggestions(intent: Intent): boolean {
  return !['GREETING', 'PRICE_ENQUIRY', 'SUBSCRIBE', 'CLOSING_READY', 'ESCALATE'].includes(intent);
}

export function shouldSuppressForReply(customerMessageText: string): boolean {
  const lower = customerMessageText.toLowerCase().trim();
  const acknowledgements = [
    'okay', 'ok', 'sípa', 'terima kasih', 'thanks', 'thank you',
    'selamat tinggal', 'bye', 'goodbye', 'tq', 'okke', 'noted',
    '👍', '👌', '🙏', '✅', 'okay thanks', 'ok tq', 'okay tq',
  ];
  if (acknowledgements.includes(lower) || acknowledgements.some(a => lower === a)) return true;
  if (lower.length <= 3 && ['ok', 'okay', 'tq', 'bye'].includes(lower)) return true;
  return false;
}

export function hasSuggestionBlock(msg: string): boolean {
  return /\(Taip apa-apa soalan sendiri\)/.test(msg);
}

export function inferIntentFromAssistantMsg(msg: string): Intent | null {
  for (const faq of PINTARWEB_FAQ) {
    const sig = faq.answer.substring(0, 50);
    if (msg.includes(sig)) return faq.intent;
  }
  if (msg.includes('RM446 total') || msg.includes('RM446 untuk')) return 'PRICE_ENQUIRY';
  if (msg.includes('Proses 4 minggu')) return 'HOW_IT_WORKS';
  if (msg.includes('RM297 (fi persediaan)')) return 'FAQ_SETUP_FEE';
  if (msg.includes('Details payment')) return 'CLOSING_READY';
  if (msg.includes('Selamat datang')) return 'GREETING';
  if (msg.includes('Harga PintarWeb')) return 'PRICE_ENQUIRY';
  return null;
}

export function mapSuggestionClick(lastAssistantMsg: string, clicked: '1' | '2'): Intent {
  const inferred = inferIntentFromAssistantMsg(lastAssistantMsg);
  if (inferred && SUGGESTION_MAP[inferred]) {
    const def = SUGGESTION_MAP[inferred]!;
    if (lastAssistantMsg.includes(def.questions[0]) || lastAssistantMsg.includes(def.questions[1])) {
      return def.onSelect[clicked === '1' ? 0 : 1];
    }
  }
  return clicked === '1' ? 'PRICE_ENQUIRY' : 'FAQ_TIMELINE';
}

export function formatSuggestionBlock(def: SuggestionDef): string {
  return (
    `1️⃣ ${def.questions[0]}\n` +
    `2️⃣ ${def.questions[1]}\n` +
    '(Taip apa-apa soalan sendiri)'
  );
}

export async function sendFormattedReply(
  env: Env,
  tenantContext: TenantContext,
  customerPhone: string,
  reply: string,
  intent: Intent,
  customerMessageText: string,
  db: any
): Promise<void> {
  const token = tenantContext.wabaAccount.access_token;
  const phoneNumberId = tenantContext.phoneNumberId;
  const wabaId = tenantContext.wabaId;
  const hasSuggestions = intentHasSuggestions(intent);
  const suppressed = shouldSuppressForReply(customerMessageText);
  let finalReply: string;

  if (hasSuggestions && !suppressed) {
    const suggestionDef = getSuggestions(intent);
    if (suggestionDef) {
      const cleanReply = reply.replace(/\n\nAda lagi yang nak tahu\? 💬$/, '');
      finalReply = cleanReply + '\n\n' + formatSuggestionBlock(suggestionDef);
    } else {
      finalReply = reply;
    }
  } else {
    finalReply = reply;
  }

  await sendWhatsAppMessage(token, phoneNumberId, customerPhone, finalReply);
  await storeMessage(db, wabaId, customerPhone, 'assistant', finalReply);
}

export function handleIntent(intent: Intent, customerName: string, businessName: string): string {
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
      if (answer) return answer;
      return '';
    }
    case 'PRICE_ENQUIRY':
      return PRICING_ANSWER;
    case 'SUBSCRIBE':
      return 'Nak start dengan PintarWeb? Sedia!\n\nJawab dengan nombor:\n1️⃣ Saya nak terus mula — saya hantar details payment\n2️⃣ Saya nak tahu lagi — apa yang ragu-ragu?';
    case 'CLOSING_READY':
      return CLOSING_READY_ANSWER;
    case 'HOW_IT_WORKS':
      return HOW_IT_WORKS_ANSWER;
    case 'SUPPORT':
    case 'ESCALATE':
      return 'Okay, saya akan forward ini ke team kami. Mereka akan hubungi anda tidak lama. 💬\n\nUntuk respons yang lebih cepat, anda boleh WhatsApp kami terus: +60196556243';
    case 'UNCLEAR':
      return 'Maaf, saya tak pasti faham dengan tepat. 💬\n\nBoleh explain lagi apa yang anda nak? Contoh:\n- "Harga berapa?"\n- "Nak subscribe macam mana?"\n- "Berapa lama nak siap?"';
    default:
      return 'Ada lagi yang nak tahu? 💬';
  }
}

export async function callClaude(
  env: Env,
  systemPrompt: string,
  messages: Array<{ role: string; content: string }>,
  maxTokens: number = 80
): Promise<string | null> {
  try {
    const anthropicMessages = messages.map(m => ({
      role: m.role === 'customer' ? 'user' : m.role,
      content: m.content,
    }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: anthropicMessages,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`[Claude] API error: ${response.status} - ${error.substring(0, 100)}`);
      return null;
    }

    const data: any = await response.json();
    const reply = data.content?.[0]?.text?.trim() || null;
    return reply;
  } catch (err) {
    console.error(`[Claude] Call failed: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

export async function callWorkersAI(
  env: Env,
  messages: Array<{ role: string; content: string }>,
  maxTokens: number = 80
): Promise<string | null> {
  try {
    const aiPromise = (env.AI as any).run('@cf/meta/llama-3.2-3b-instruct', {
      messages,
      max_tokens: maxTokens,
      temperature: 0.3,
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI timeout')), 8000)
    );

    const result: any = await Promise.race([aiPromise, timeoutPromise]);
    return result.response || null;
  } catch (err) {
    console.error(`[Workers AI] Call failed: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

export async function handleIncomingMessage(
  env: Env,
  tenantContext: TenantContext,
  customerPhone: string,
  customerName: string,
  messageText: string
): Promise<void> {
  const db = env.pintarweb_outreach_db;
  const token = tenantContext.wabaAccount.access_token;
  const phoneNumberId = tenantContext.phoneNumberId;
  const wabaId = tenantContext.wabaId;
  const companyName = tenantContext.companyName;

  try {
    await storeMessage(db, wabaId, customerPhone, 'customer', messageText);
    const alreadyGreeted = await wasGreetingSent(db, wabaId, customerPhone);

    if (['1', '2', '3'].includes(messageText.trim())) {
      const recentHistory = await getConversationHistory(db, wabaId, customerPhone, 4);
      const lastAssistantMsg = recentHistory.filter((m: { role: string; content: string }) => m.role === 'assistant').at(-1);
      const hasPricingMenu = lastAssistantMsg && /Jawab dengan nombor/i.test(lastAssistantMsg.content);
      const hasGreetingMenu = lastAssistantMsg && /Soalan lain|tolong dengan/i.test(lastAssistantMsg.content);

      if (hasPricingMenu) {
        const pmIntent = messageText.trim() === '1' ? 'CLOSING_READY' : 'HOW_IT_WORKS';
        const reply = handleIntent(pmIntent, customerName, companyName);
        await sendFormattedReply(env, tenantContext, customerPhone, reply, pmIntent, messageText, db);
        return;
      }

      if (hasGreetingMenu) {
        const greetingIntents: Record<string, Intent> = { '1': 'PRICE_ENQUIRY', '2': 'SUBSCRIBE', '3': 'UNCLEAR' };
        const intent = greetingIntents[messageText.trim()];
        const reply = handleIntent(intent, customerName, companyName);
        await sendFormattedReply(env, tenantContext, customerPhone, reply, intent, messageText, db);
        return;
      }
    }

    if (['1', '2'].includes(messageText.trim()) && alreadyGreeted) {
      const recentHistory = await getConversationHistory(db, wabaId, customerPhone, 5);
      const lastAssistantMsg = recentHistory.filter((m: { role: string; content: string }) => m.role === 'assistant').at(-1);

      if (lastAssistantMsg && hasSuggestionBlock(lastAssistantMsg.content)) {
        const clickedNumber = messageText.trim() as '1' | '2';
        const suggestionIntent = mapSuggestionClick(lastAssistantMsg.content, clickedNumber);
        const reply = handleIntent(suggestionIntent, customerName, companyName);
        await sendFormattedReply(env, tenantContext, customerPhone, reply, suggestionIntent, messageText, db);
        return;
      }
    }

    const intent = classifyIntent(messageText);

    if (!alreadyGreeted) {
      const reply = GREETING_ANSWER.replace('Selamat datang! 👋 Saya pembantu PintarWeb.', `Hi ${customerName}! Selamat datang! 👋 Saya pembantu ${companyName}.`);
      await sendWhatsAppMessage(token, phoneNumberId, customerPhone, reply);
      await storeMessage(db, wabaId, customerPhone, 'assistant', reply);
      await markGreetingSent(db, wabaId, customerPhone);
      return;
    }

    const needsLLM = (intent === 'UNCLEAR' || intent === 'GREETING');

    if (needsLLM) {
      const conversationHistory = await getConversationHistory(db, wabaId, customerPhone);

      if (conversationHistory.length > 0) {
        const simpleGreetings = ['apa khabar', 'khabar apa', 'ada khabar', 'selamat pagi', 'selamat malam', 'selamat petang', 'good morning', 'good night', 'good afternoon'];
        const isSimpleGreeting = simpleGreetings.some(g => messageText.toLowerCase().includes(g)) && messageText.length < 30;

        let reply: string | null = null;

        if (!isSimpleGreeting) {
          const systemPrompt = `You are a WhatsApp assistant for ${companyName} in ${tenantContext.area}. ${companyName} builds websites, WhatsApp auto-reply bots, and local SEO for small businesses. NEVER mention AC, plumbing, electrical, or any physical service. NEVER invent business names, websites, or services not listed here.

STRICT LANGUAGE RULES:
- Reply Malaysian Bahasa Melayu ONLY. Never Indonesian.
- Use "tolong" for help, NOT "bantu" in requests like "apa boleh tolong"
- Use "bergantung" or "terpulang" for "depends", NOT "tergantung"
- Use "butiran" or "keterangan" for "details", NOT "rincian"
- Use "untuk" as preposition "for", NOT as a substitute for other words
- Use "bagi" sparingly, prefer "untuk"
- Never use "sama" to mean "with" — use "dengan" instead (e.g., "untuk kamu dengan saya")
- Keep replies 1-2 short sentences. Keep it conversational.`;

          const chatMessages = [{ role: 'user', content: messageText }];
          reply = await callClaude(env, systemPrompt, chatMessages, 80);

          if (!reply) {
            reply = await callWorkersAI(env, [{ role: 'system', content: systemPrompt }, ...chatMessages], 80);
          }
        } else {
          reply = 'Hola! Saya di sini. Nak tanya apa-apa? 😄';
        }

        if (!reply) {
          reply = 'Hmm, saya akan tanya team dulu. Saya hubungi awak tidak lama lagi. 💬';
        }

        await sendFormattedReply(env, tenantContext, customerPhone, reply, intent, messageText, db);
        await notifyOwner(token, phoneNumberId, tenantContext.ownerPhone, customerName, customerPhone, messageText, intent, companyName);
        return;
      }
    }

    const reply = handleIntent(intent, customerName, companyName);
    await notifyOwner(token, phoneNumberId, tenantContext.ownerPhone, customerName, customerPhone, messageText, intent, companyName);
    await sendFormattedReply(env, tenantContext, customerPhone, reply, intent, messageText, db);
  } catch (err) {
    console.error('[WA Bot] handleIncomingMessage error:', err);
  }
}
