import type { Env, TenantContext, TenantWabaAccount } from './types';

export function formatPhone(phone: string): string {
  let num = phone.replace(/\D/g, '');
  if (num.startsWith('60')) return num;
  if (num.startsWith('0')) return '6' + num;
  return num;
}

export async function sendWhatsAppMessage(
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

export async function notifyOwner(
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

export async function storeMessage(
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

export async function getConversationHistory(
  db: any,
  wabaId: string,
  customerPhone: string,
  limit?: number
): Promise<Array<{ role: string; content: string }>> {
  const limitClause = limit ? `LIMIT ${limit}` : 'LIMIT 10';
  const result = await db
    .prepare(
      `SELECT role, message FROM whatsapp_bot_conversations
       WHERE waba_id = ? AND customer_phone = ?
       ORDER BY created_at DESC
       ${limitClause}`
    )
    .bind(wabaId, customerPhone)
    .all();

  return (result.results || []).reverse().map((row: any) => ({
    role: row.role,
    content: row.message,
  }));
}

export async function wasGreetingSent(db: any, wabaId: string, customerPhone: string): Promise<boolean> {
  const result = await db
    .prepare(`SELECT 1 FROM whatsapp_bot_greetings WHERE waba_id = ? AND customer_phone = ?`)
    .bind(wabaId, customerPhone)
    .first();
  return result !== null;
}

export async function markGreetingSent(db: any, wabaId: string, customerPhone: string): Promise<void> {
  await db
    .prepare(
      `INSERT OR REPLACE INTO whatsapp_bot_greetings (waba_id, customer_phone, sent_at)
       VALUES (?, ?, datetime('now'))`
    )
    .bind(wabaId, customerPhone)
    .run();
}

export async function resolveTenantContext(db: any, phoneNumberId: string, env: Env): Promise<TenantContext | null> {
  const wabaRows = await db
    .prepare(
      `SELECT waba_id, phone_number_id, client_id, access_token, business_account_id, display_name, is_default, status
       FROM waba_accounts WHERE phone_number_id = ?`
    )
    .bind(phoneNumberId)
    .all();

  if (!wabaRows.results || wabaRows.results.length === 0) {
    console.error(`[TenantContext] No waba_account found for phone_number_id: ${phoneNumberId}`);
    return null;
  }

  const wabaRow: any = wabaRows.results[0];
  const clientId = wabaRow.client_id;
  const wabaId = wabaRow.waba_id;

  const clientRows = await db.prepare(`SELECT * FROM clients WHERE id = ?`).bind(clientId).first();
  if (!clientRows) {
    console.error(`[TenantContext] No client found for client_id: ${clientId}`);
    return null;
  }

  const featureRows: any = await db
    .prepare(`SELECT feature, enabled, value FROM client_features WHERE client_id = ?`)
    .bind(clientId)
    .all();

  const features: Record<string, string | null> = {};
  for (const row of featureRows.results || []) {
    features[row.feature] = row.enabled ? (row.value ?? null) : null;
  }

  const configRows = await db
    .prepare(`SELECT niche, business_hours, closing_flow_enabled, area, services, price_display FROM whatsapp_bot_config WHERE client_id = ?`)
    .bind(clientId)
    .first();

  const defaultWaba: TenantWabaAccount = {
    id: wabaRow.id,
    waba_id: wabaId,
    phone_number_id: wabaRow.phone_number_id,
    phone_number: wabaRow.phone_number || '',
    access_token: wabaRow.access_token === 'META_ACCESS_TOKEN' ? env.META_ACCESS_TOKEN : wabaRow.access_token,
    business_account_id: wabaRow.business_account_id,
    display_name: wabaRow.display_name || '',
    is_default: wabaRow.is_default,
    status: wabaRow.status,
  };

  return {
    clientId,
    companyName: clientRows.company_name || clientRows.business_name || 'Business',
    subscriptionStatus: clientRows.subscription_status || 'trial',
    subscriptionTier: clientRows.subscription_tier || 'asas',
    ownerName: clientRows.owner_name || null,
    ownerPhone: clientRows.owner_phone || '',
    features,
    niche: configRows?.niche || 'pintarweb',
    area: configRows?.area || '',
    services: configRows?.services || '',
    priceDisplay: configRows?.price_display || '',
    businessHours: configRows?.business_hours || null,
    closingFlowEnabled: (configRows?.closing_flow_enabled ?? 1) === 1,
    wabaAccount: defaultWaba,
    wabaId,
    phoneNumberId,
  };
}
