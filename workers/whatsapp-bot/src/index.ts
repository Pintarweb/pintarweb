import { generateBookingLink } from './bot-logic';
import { handleAdminApi } from './admin-api';
import { handleIncomingMessage } from './bot-logic';
import { resolveTenantContext } from './kb';
import type { Env } from './types';

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
        const msg = messages[0];

        if (msg.type !== 'text' || !msg.text?.body) {
          return new Response('OK', { status: 200 });
        }

        const customerPhone = msg.from;
        const customerName = body.entry[0].changes[0].value.contacts?.[0]?.profile?.name ?? 'Pelanggan';
        const messageText = msg.text.body.trim();

        const tenantContext = await resolveTenantContext(env.pintarweb_outreach_db, phoneNumberId, env);
        if (!tenantContext) {
          console.error(`[WA Bot] Unknown phone_number_id: ${phoneNumberId} — dropping message`);
          return new Response('OK', { status: 200 });
        }

        console.log(`[WA Bot] [${tenantContext.companyName}] Message from ${customerPhone}: ${messageText}`);
        await handleIncomingMessage(env, tenantContext, customerPhone, customerName, messageText);

        return new Response('OK', { status: 200 });
      } catch (err) {
        console.error('[WA Bot] Webhook error:', err);
        return new Response('OK', { status: 200 });
      }
    }

    if (url.pathname.startsWith('/admin/api')) {
      return handleAdminApi(request, env);
    }

    if (request.method === 'GET' && url.pathname === '/booking') {
      const token = url.searchParams.get('token');
      const company = url.searchParams.get('company') || 'Business';

      if (!token) {
        return new Response('Token required', { status: 400 });
      }

      try {
        const decoded = atob(token);
        const [phone, timestamp] = decoded.split('|');

        // Token expires after 60 minutes
        const elapsed = Date.now() - parseInt(timestamp);
        if (elapsed > 60 * 60 * 1000) {
          return new Response('Booking link expired', { status: 410 });
        }

        return new Response(bookingPage(phone, company), {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      } catch {
        return new Response('Invalid token', { status: 400 });
      }
    }

    return new Response('Not found', { status: 404 });
  },
};

function bookingPage(phone: string, company: string): string {
  return `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Konsultasi - ${escapeHtml(company)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      color: #111;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 16px;
    }
    .card {
      background: white;
      border-radius: 12px;
      padding: 32px 24px;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 2px 16px rgba(0,0,0,0.08);
    }
    h1 { font-size: 20px; margin-bottom: 8px; }
    .sub { color: #666; font-size: 14px; margin-bottom: 24px; }
    label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 4px; color: #444; }
    input, select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 15px;
      margin-bottom: 16px;
    }
    button {
      width: 100%;
      padding: 12px;
      background: #25D366;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
    }
    button:hover { background: #1ebe57; }
    .note { font-size: 12px; color: #999; text-align: center; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🗓️ Booking Konsultasi Percuma</h1>
    <p class="sub">${escapeHtml(company)} — pilih masa yang sesuai untuk sesi 15 minit.</p>
    <form id="bookingForm">
      <label for="date">Tarikh</label>
      <input type="date" id="date" required min="${new Date().toISOString().split('T')[0]}">
      <label for="slot">Slot Masa</label>
      <select id="slot" required>
        <option value="">-- Pilih Slot --</option>
        <option value="9:00 AM">9:00 AM</option>
        <option value="10:00 AM">10:00 AM</option>
        <option value="11:00 AM">11:00 AM</option>
        <option value="2:00 PM">2:00 PM</option>
        <option value="3:00 PM">3:00 PM</option>
        <option value="4:00 PM">4:00 PM</option>
      </select>
      <label for="name">Nama</label>
      <input type="text" id="name" placeholder="Nama anda" required>
      <label for="note">Nota (optional)</label>
      <input type="text" id="note" placeholder="Apa yang nak dibincangkan?">
      <button type="submit">Hantar Booking 🚀</button>
    </form>
    <p class="note">Booking percuma, 15 minit. Kami akan hubungi anda melalui WhatsApp untuk pengesahan.</p>
  </div>
  <script>
    const phone = "${phone}";
    document.getElementById('bookingForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const date = document.getElementById('date').value;
      const slot = document.getElementById('slot').value;
      const name = document.getElementById('name').value;
      const note = document.getElementById('note').value || '-';
      const msg = "Salam! Saya " + name + " nak booking konsultasi pada " + date + " (" + slot + "). Nota: " + note;
      window.open("https://wa.me/" + phone + "?text=" + encodeURIComponent(msg), "_blank");
      document.querySelector('.card').innerHTML =
        '<h1>✅ Booking Dihantar!</h1><p style="margin-top:12px">Kami akan hubungi anda tidak lama lagi untuk pengesahan. Terima kasih!</p>';
    });
  </script>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"');
}
