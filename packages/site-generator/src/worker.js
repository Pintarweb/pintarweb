export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;

        // Health check
        if (path === '/health') {
            return new Response('OK', { status: 200 });
        }

        // Track open/click events
        if (path === '/api/track' && request.method === 'POST') {
            const body = await request.json();
            const id = crypto.randomUUID();
            await env.DB.prepare(
                'INSERT INTO outreach_events (id, lead_id, event_type, notes) VALUES (?, ?, ?, ?)'
            ).bind(id, body.lead_id, body.event_type, body.notes || '').run();
            return new Response('OK', { status: 200 });
        }

        return new Response('Not found', { status: 404 });
    }
};