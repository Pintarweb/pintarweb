interface Env {
  DEEPSEEK_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const body = await request.json();

      body.stream = true;
      delete body.max_tokens;
      body.max_tokens = 500;

      const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify(body),
      });

      if (!deepseekResponse.ok) {
        const error = await deepseekResponse.text();
        return new Response(error, { status: deepseekResponse.status });
      }

      const reader = deepseekResponse.body?.getReader();
      if (!reader) {
        return new Response('No response body', { status: 502 });
      }

      const decoder = new TextDecoder();
      let fullContent = '';
      let reasoningContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta;
              if (delta?.content) {
                fullContent += delta.content;
              }
              if (delta?.reasoning_content) {
                reasoningContent += delta.reasoning_content;
              }
            } catch {
              // Skip malformed JSON lines
            }
          }
        }
      }

      const responseBody = {
        id: `proxy-${Date.now()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: body.model || 'deepseek-chat',
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: fullContent,
            reasoning_content: reasoningContent || undefined,
          },
          finish_reason: 'stop',
        }],
      };

      return new Response(JSON.stringify(responseBody), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    } catch (err) {
      console.error('[Proxy] Error:', err);
      return new Response(JSON.stringify({ error: { message: String(err) } }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
