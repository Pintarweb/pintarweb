import type { Env } from './types';
import { resolveTenantContext } from './kb';
import { handleIncomingMessage } from './bot-logic';
import { handleAdminApi } from './admin-api';

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

    return new Response('Not found', { status: 404 });
  },
};
