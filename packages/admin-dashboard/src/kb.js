// ─── KB Tab (3-Layer) ─────────────────────────────────────────────────────────

async function loadClientKb(id) {
  const [niches, clientKb] = await Promise.all([
    api('GET', '/niches'),
    api('GET', `/clients/${id}/kb`),
  ]);

  const parseFaqs = (faqJson) => { try { return JSON.parse(faqJson || '[]'); } catch { return []; } };
  const parseObj = (objJson) => { try { return JSON.parse(objJson || '[]'); } catch { return []; } };
  const parsePrice = (priceJson) => { try { const p = JSON.parse(priceJson || '{}'); return Object.keys(p).length > 0; } catch { return false; } };

  const nicheSection = niches && niches.length > 0 ? `
    <div class="mb-8">
      <div class="flex justify-between items-center mb-3">
        <div>
          <h3 class="font-bold text-gray-800 text-sm uppercase tracking-wide">Layer 2 — Niche Knowledge</h3>
          <p class="text-xs text-gray-500 mt-0.5">Dikongsi oleh semua client dalam niche yang sama. Read-only.</p>
        </div>
        <span class="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">📖 Read-only</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${niches.map(n => {
          const faqs = parseFaqs(n.faq_json);
          const objs = parseObj(n.objections_json);
          const hasPrice = parsePrice(n.price_ranges_json);
          return `
          <div class="bg-purple-50 rounded-xl border border-purple-200 p-5">
            <div class="flex justify-between items-start mb-3">
              <h4 class="font-bold text-purple-900 capitalize">${esc(n.id)}</h4>
              <span class="bg-purple-200 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full">Niche</span>
            </div>
            <div class="text-xs text-purple-700 space-y-1">
              <div>📋 ${faqs.length} FAQ entries</div>
              <div>${hasPrice ? '💰 Price ranges ada' : '💰 Tiada price ranges'}</div>
              <div>🛡️ ${objs.length} objection-response pairs</div>
            </div>
          </div>`;}).join('')}
      </div>
    </div>` : '';

  const clientKbSection = `
    <div>
      <div class="flex justify-between items-center mb-3">
        <div>
          <h3 class="font-bold text-gray-800 text-sm uppercase tracking-wide">Layer 3 — Client KB</h3>
          <p class="text-xs text-gray-500 mt-0.5">Unik untuk client ini. Boleh tambah atau override niche di atas.</p>
        </div>
        <button onclick="openClientKbEditor('${id}', null)" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition">
          + Tambah Client KB
        </button>
      </div>
      ${clientKb && clientKb.length > 0 ? `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${clientKb.map(entry => {
          const faqs = parseFaqs(entry.faq_json);
          const objs = parseObj(entry.objections_json);
          const hasPrice = parsePrice(entry.price_ranges_json);
          return `
          <div class="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 transition cursor-pointer"
               onclick="openClientKbEditor('${id}', '${entry.id}')">
            <div class="flex justify-between items-start mb-3">
              <h4 class="font-bold text-gray-900 capitalize">${esc(entry.niche || 'unknown')}</h4>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${entry.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}">
                ${entry.is_active ? 'Aktif' : 'Tak aktif'}
              </span>
            </div>
            <div class="text-xs text-gray-500 space-y-1">
              <div>📋 ${faqs.length} FAQ entries</div>
              <div>${hasPrice ? '💰 Price ranges ada' : '💰 Tiada price ranges'}</div>
              <div>🛡️ ${objs.length} objection-response pairs</div>
            </div>
          </div>`;}).join('')}
      </div>` : `
      <div class="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <div class="text-3xl mb-2">📝</div>
        <p class="text-sm">Tiada Client KB lagi.</p>
        <p class="text-xs mt-1">Tambah KB untuk client ini — ia akan override Layer 2 (Niche).</p>
      </div>`}
    </div>`;

  document.getElementById('client-tab-content').innerHTML = nicheSection + clientKbSection;
}

// ─── Prompts Tab ─────────────────────────────────────────────────────────────

async function loadClientPrompts(id) {
  const prompts = await api('GET', `/clients/${id}/prompts`);
  if (!prompts) return;

  const basePrompt = prompts.find(p => p.prompt_type === 'base');
  const fallbackPrompt = prompts.find(p => p.prompt_type === 'fallback');

  document.getElementById('client-tab-content').innerHTML = `
    <div class="mb-4">
      <h3 class="font-bold text-gray-800 text-sm uppercase tracking-wide">Layer 1 — System Prompts</h3>
      <p class="text-xs text-gray-500 mt-0.5">Base prompt + fallback prompt untuk client ini.</p>
    </div>
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <p class="text-gray-600 text-sm">System prompts yang bot guna untuk response.</p>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h4 class="font-bold text-gray-900">Base Prompt</h4>
            <p class="text-xs text-gray-500 mt-0.5">System prompt utama — определяет how bot behave</p>
          </div>
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${basePrompt?.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}">
            ${basePrompt?.is_active ? 'Aktif' : 'Tak aktif'}
          </span>
        </div>
        <div class="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto mb-3">${esc(basePrompt?.prompt_text || '—')}</div>
        <button onclick="openClientPromptsEditor('${id}', 'base', ${JSON.stringify(esc(basePrompt?.prompt_text || '')).replace(/"/g, '&quot;')})"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          Edit Base Prompt
        </button>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h4 class="font-bold text-gray-900">Fallback Prompt</h4>
            <p class="text-xs text-gray-500 mt-0.5">Response bila bot tak dapat classify intent</p>
          </div>
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${fallbackPrompt?.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}">
            ${fallbackPrompt?.is_active ? 'Aktif' : 'Tak aktif'}
          </span>
        </div>
        <div class="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 font-mono whitespace-pre-wrap max-h-24 overflow-y-auto mb-3">${esc(fallbackPrompt?.prompt_text || '—')}</div>
        <button onclick="openClientPromptsEditor('${id}', 'fallback', ${JSON.stringify(esc(fallbackPrompt?.prompt_text || '')).replace(/"/g, '&quot;')})"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          Edit Fallback Prompt
        </button>
      </div>
    </div>`;
}
