export default {
  async fetch(request: Request, env: any): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('POST only', { status: 405 });
    }

    const { model, messages, max_tokens = 200, temperature = 0.3 } = await request.json();

    if (!model || !messages) {
      return new Response('Missing model or messages', { status: 400 });
    }

    try {
      const start = Date.now();
      const result = await env.AI.run(model, {
        messages,
        max_tokens,
        temperature,
      });
      const latency = Date.now() - start;

      return new Response(JSON.stringify({
        model,
        latency_ms: latency,
        response: typeof result === 'string' ? result : result.response || result.content || JSON.stringify(result),
        raw: result,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
