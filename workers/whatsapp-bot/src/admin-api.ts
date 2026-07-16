import type { Env } from './types';

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://pintarweb-admin.pages.dev',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function requireAdmin(request: Request, env: Env): Response | null {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token || token !== env.ADMIN_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }
  return null;
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

export function created(data: unknown): Response {
  return json(data, 201);
}

export function noContent(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export function buildAdminRouter(db: any) {
  async function handleClients(path: string, method: string, body: any): Promise<Response> {
    if (path === '' || path === '/') {
      if (method === 'GET') {
        const rows = await db.prepare('SELECT * FROM clients ORDER BY created_at DESC').all();
        return json(rows.results || []);
      }
      if (method === 'POST') {
        const id = body.id || crypto.randomUUID();
        await db.prepare(
          `INSERT INTO clients (id, company_name, subscription_status, subscription_tier, subscription_start, owner_name, owner_phone, owner_email, billing_cycle, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
        ).bind(
          id, body.company_name, body.subscription_status || 'trial',
          body.subscription_tier || 'asas', body.subscription_start || null,
          body.owner_name || null, body.owner_phone || null,
          body.owner_email || null, body.billing_cycle || 'monthly'
        ).run();
        const row = await db.prepare('SELECT * FROM clients WHERE id = ?').bind(id).first();
        return created(row);
      }
    }

    const id = path.replace(/^\//, '');
    if (!id) return json({ error: 'Client ID required' }, 400);

    if (method === 'GET') {
      const row = await db.prepare('SELECT * FROM clients WHERE id = ?').bind(id).first();
      return row ? json(row) : json({ error: 'Not found' }, 404);
    }
    if (method === 'PUT') {
      await db.prepare(
        `UPDATE clients SET company_name=?, subscription_status=?, subscription_tier=?,
         subscription_start=?, subscription_end=?, billing_cycle=?, owner_name=?,
         owner_phone=?, owner_email=?, updated_at=datetime('now')
         WHERE id=?`
      ).bind(
        body.company_name, body.subscription_status, body.subscription_tier,
        body.subscription_start || null, body.subscription_end || null,
        body.billing_cycle, body.owner_name || null, body.owner_phone || null,
        body.owner_email || null, id
      ).run();
      const row = await db.prepare('SELECT * FROM clients WHERE id = ?').bind(id).first();
      return row ? json(row) : json({ error: 'Not found' }, 404);
    }
    if (method === 'DELETE') {
      await db.prepare('DELETE FROM clients WHERE id = ?').bind(id).run();
      return noContent();
    }

    return json({ error: 'Method not allowed' }, 405);
  }

  async function handleFeatures(path: string, method: string, body: any): Promise<Response> {
    const strippedParts = path.replace(/^\//, '').split('/');
    const clientId = strippedParts[0];
    if (!clientId) return json({ error: 'Client ID required' }, 400);

    if (strippedParts.length === 1 || strippedParts[1] === '' || strippedParts[1] === 'features') {
      if (method === 'GET') {
        const rows = await db.prepare('SELECT * FROM client_features WHERE client_id = ?').bind(clientId).all();
        return json(rows.results || []);
      }
      if (method === 'PUT') {
        for (const feature of body.features || []) {
          await db.prepare(
            `INSERT INTO client_features (id, client_id, feature, enabled, value, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
             ON CONFLICT(client_id, feature) DO UPDATE SET
               enabled=excluded.enabled, value=excluded.value, updated_at=datetime('now')`
          ).bind(
            feature.id || crypto.randomUUID(), clientId, feature.feature,
            feature.enabled ? 1 : 0, feature.value || null
          ).run();
        }
        const rows = await db.prepare('SELECT * FROM client_features WHERE client_id = ?').bind(clientId).all();
        return json(rows.results || []);
      }
    }
    return json({ error: 'Not found' }, 404);
  }

  async function handleWabas(path: string, method: string, body: any): Promise<Response> {
    const parts = path.replace(/^\//, '').split('/');
    const id = parts[1];

    if (!id && method === 'GET') {
      const rows = await db.prepare('SELECT * FROM waba_accounts ORDER BY created_at DESC').all();
      return json(rows.results || []);
    }
    if (!id) return json({ error: 'WABA ID required' }, 400);

    if (method === 'GET') {
      const row = await db.prepare('SELECT * FROM waba_accounts WHERE id = ?').bind(id).first();
      return row ? json(row) : json({ error: 'Not found' }, 404);
    }
    if (method === 'PUT') {
      await db.prepare(
        `UPDATE waba_accounts SET phone_number=?, display_name=?, is_default=?,
         status=?, updated_at=datetime('now') WHERE id=?`
      ).bind(
        body.phone_number || null, body.display_name || null,
        body.is_default ? 1 : 0, body.status || 'active', id
      ).run();
      const row = await db.prepare('SELECT * FROM waba_accounts WHERE id = ?').bind(id).first();
      return row ? json(row) : json({ error: 'Not found' }, 404);
    }
    if (method === 'DELETE') {
      await db.prepare('DELETE FROM waba_accounts WHERE id = ?').bind(id).run();
      return noContent();
    }
    if (method === 'POST') {
      const clientId = parts[2];
      if (!clientId) return json({ error: 'Client ID required' }, 400);
      const newId = body.id || crypto.randomUUID();
      await db.prepare(
        `INSERT INTO waba_accounts (id, client_id, waba_id, phone_number_id, phone_number, access_token, business_account_id, display_name, is_default, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
      ).bind(
        newId, clientId, body.waba_id || '', body.phone_number_id || '',
        body.phone_number || null, body.access_token || 'META_ACCESS_TOKEN',
        body.business_account_id || null, body.display_name || null,
        body.is_default ? 1 : 0, body.status || 'pending'
      ).run();
      const row = await db.prepare('SELECT * FROM waba_accounts WHERE id = ?').bind(newId).first();
      return created(row);
    }
    return json({ error: 'Method not allowed' }, 405);
  }

  async function handleConversations(path: string, method: string, url: URL): Promise<Response> {
    const parts = path.replace(/^\//, '').split('/');
    const clientId = parts[0];
    if (!clientId) return json({ error: 'Client ID required' }, 400);

    const phone = url.searchParams.get('phone');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    let query = `SELECT c.* FROM whatsapp_bot_conversations c JOIN whatsapp_bot_config w ON c.waba_id = w.waba_id WHERE w.client_id = ?`;
    const binds: any[] = [clientId];
    if (phone) { query += ' AND c.customer_phone = ?'; binds.push(phone); }
    query += ' ORDER BY c.created_at DESC LIMIT ?';
    binds.push(limit);

    const rows = await db.prepare(query).bind(...binds).all();
    return json(rows.results || []);
  }

  async function handleLeads(path: string, method: string): Promise<Response> {
    const parts = path.replace(/^\//, '').split('/');
    const clientId = parts[0];
    if (!clientId) return json({ error: 'Client ID required' }, 400);
    if (method === 'GET') {
      const rows = await db.prepare(
        'SELECT * FROM whatsapp_bot_leads WHERE client_id = ? ORDER BY created_at DESC LIMIT 100'
      ).bind(clientId).all();
      return json(rows.results || []);
    }
    return json({ error: 'Method not allowed' }, 405);
  }

  async function handleStats(): Promise<Response> {
    const clients = await db.prepare('SELECT COUNT(*) as count FROM clients').first();
    const wabas = await db.prepare('SELECT COUNT(*) as count FROM waba_accounts').first();
    const conversations = await db.prepare('SELECT COUNT(*) as count FROM whatsapp_bot_conversations').first();
    const leads = await db.prepare('SELECT COUNT(*) as count FROM whatsapp_bot_leads').first();
    const activeClients = await db.prepare("SELECT COUNT(*) as count FROM clients WHERE subscription_status = 'active'").first();
    return json({
      totalClients: clients?.count || 0,
      activeClients: activeClients?.count || 0,
      totalWabas: wabas?.count || 0,
      totalConversations: conversations?.count || 0,
      totalLeads: leads?.count || 0,
    });
  }

  async function handlePrompts(path: string, method: string, body: any): Promise<Response> {
    const parts = path.replace(/^\//, '').split('/');
    const clientId = parts[0];
    if (!clientId) return json({ error: 'Client ID required' }, 400);

    if (method === 'GET') {
      const rows = await db.prepare(
        'SELECT * FROM bot_system_prompts WHERE client_id = ? ORDER BY prompt_type'
      ).bind(clientId).all();
      return json(rows.results || []);
    }

    if ((method === 'PUT' || method === 'POST') && parts[1]) {
      const promptType = parts[1];
      const existing = await db.prepare(
        'SELECT * FROM bot_system_prompts WHERE client_id = ? AND prompt_type = ?'
      ).bind(clientId, promptType).first();

      if (existing) {
        await db.prepare(
          `UPDATE bot_system_prompts SET prompt_text=?, is_active=?, updated_at=datetime('now')
           WHERE client_id=? AND prompt_type=?`
        ).bind(body.prompt_text || '', body.is_active !== false ? 1 : 0, clientId, promptType).run();
      } else {
        await db.prepare(
          `INSERT INTO bot_system_prompts (id, client_id, prompt_type, prompt_text, version, is_active, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
        ).bind(
          body.id || crypto.randomUUID(), clientId, promptType,
          body.prompt_text || '', body.version || 1, body.is_active !== false ? 1 : 0
        ).run();
      }
      const row = await db.prepare(
        'SELECT * FROM bot_system_prompts WHERE client_id = ? AND prompt_type = ?'
      ).bind(clientId, promptType).first();
      return row ? json(row) : json({ error: 'Not found' }, 404);
    }

    return json({ error: 'Not found' }, 404);
  }

  async function handleKb(path: string, method: string, body: any): Promise<Response> {
    const parts = path.replace(/^\//, '').split('/');
    const clientId = parts[0];
    if (!clientId) return json({ error: 'Client ID required' }, 400);

    if (method === 'GET') {
      const rows = await db.prepare(
        'SELECT * FROM kb_knowledge WHERE client_id = ? ORDER BY niche'
      ).bind(clientId).all();
      return json(rows.results || []);
    }
    if (method === 'POST') {
      const newId = body.id || crypto.randomUUID();
      await db.prepare(
        `INSERT INTO kb_knowledge (id, client_id, waba_id, knowledge_scope, niche, faq_json, price_ranges_json, objections_json, version, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
      ).bind(
        newId, clientId, body.waba_id || null, body.knowledge_scope || 'shared',
        body.niche || 'general', body.faq_json || '[]',
        body.price_ranges_json || null, body.objections_json || null,
        body.version || 1, body.is_active !== false ? 1 : 0
      ).run();
      const row = await db.prepare('SELECT * FROM kb_knowledge WHERE id = ?').bind(newId).first();
      return created(row);
    }
    if (method === 'PUT' && parts[1]) {
      const kbId = parts[1];
      await db.prepare(
        `UPDATE kb_knowledge SET faq_json=?, price_ranges_json=?, objections_json=?,
         knowledge_scope=?, waba_id=?, is_active=?, updated_at=datetime('now')
         WHERE id=? AND client_id=?`
      ).bind(
        body.faq_json || '[]', body.price_ranges_json || null,
        body.objections_json || null, body.knowledge_scope || 'shared',
        body.waba_id || null, body.is_active !== false ? 1 : 0,
        kbId, clientId
      ).run();
      const row = await db.prepare('SELECT * FROM kb_knowledge WHERE id = ?').bind(kbId).first();
      return row ? json(row) : json({ error: 'Not found' }, 404);
    }
    return json({ error: 'Not found' }, 404);
  }

  async function handleNiches(path: string, method: string): Promise<Response> {
    if (method !== 'GET') return json({ error: 'Method not allowed' }, 405);
    const rows = await db.prepare('SELECT * FROM whatsapp_bot_niche_knowledge ORDER BY id').all();
    return json(rows.results || []);
  }

  return { handleClients, handleFeatures, handleWabas, handleConversations, handleLeads, handleStats, handleKb, handlePrompts, handleNiches };
}

export async function handleAdminApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace('/admin/api', '') || '/';
  const method = request.method;

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const unauth = requireAdmin(request, env);
  if (unauth) return unauth;

  let body: any = {};
  if (request.body) {
    try { body = await request.json(); } catch { body = {}; }
  }

  const db = env.pintarweb_outreach_db;
  const router = buildAdminRouter(db);

  if (path === '/') return router.handleClients('/', method, body);
  if (path === '/stats') return router.handleStats();
  if (path.match(/^\/clients\/[^/]+\/prompts/)) return router.handlePrompts(path.replace('/clients', ''), method, body);
  if (path.match(/^\/clients\/[^/]+\/features/)) return router.handleFeatures(path.replace('/clients', ''), method, body);
  if (path.match(/^\/clients\/[^/]+\/conversations/)) return router.handleConversations(path.replace('/clients', ''), method, url);
  if (path.match(/^\/clients\/[^/]+\/leads/)) return router.handleLeads(path.replace('/clients', ''), method);
  if (path.match(/^\/clients\/[^/]+\/kb/)) return router.handleKb(path.replace('/clients', ''), method, body);
  if (path.startsWith('/clients')) return router.handleClients(path.replace('/clients', '') || '/', method, body);
  if (path.startsWith('/wabas')) return router.handleWabas(path.replace('/wabas', '') || '/', method, body);
  if (path === '/niches' || path.startsWith('/niches/')) return router.handleNiches(path, method);

  return json({ error: 'Not found' }, 404);
}
