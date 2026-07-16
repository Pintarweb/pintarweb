// ─── KB Editor Modal ─────────────────────────────────────────────────────────

async function openClientKbEditor(clientId, kbId) {
  let kb = null;
  let faqs = [];
  let priceRanges = null;
  let objections = [];
  let niche = '';

  if (kbId) {
    const allKb = await api('GET', `/clients/${clientId}/kb`);
    kb = allKb?.find(k => k.id === kbId);
    if (kb) {
      niche = kb.niche;
      try { faqs = JSON.parse(kb.faq_json || '[]'); } catch { faqs = []; }
      try { priceRanges = JSON.parse(kb.price_ranges_json || 'null'); } catch { priceRanges = null; }
      try { objections = JSON.parse(kb.objections_json || '[]'); } catch { objections = []; }
    }
  }

  renderKbEditor(clientId, kbId, niche, faqs, priceRanges, objections);
}

function renderKbEditor(clientId, kbId, niche, faqs, priceRanges, objections) {
  const modalId = 'kb-editor-modal';

  document.getElementById('app').innerHTML += `
  <div id="${modalId}" class="fixed inset-0 bg-black/50 flex items-start justify-center z-50 px-4 py-8 overflow-y-auto">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
      <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
        <h3 class="font-bold text-gray-900">${kbId ? 'Edit' : 'Tambah'} Knowledge Base: ${esc(niche || 'Niche Baru')}</h3>
        <button onclick="document.getElementById('${modalId}').remove(); renderClientDetail('${clientId}')" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
      </div>

      <div class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Niche Name *</label>
          <input type="text" id="kb-niche" value="${esc(niche)}" placeholder="e.g. aircond, plumbing, electrician"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-700">FAQ Entries</label>
            <button type="button" onclick="addFaqRow()" class="text-blue-600 hover:text-blue-800 text-sm font-medium">+ Tambah FAQ</button>
          </div>
          <div id="faq-rows" class="space-y-2">
            ${faqs.map((faq, i) => faqRowHtml(faq, i)).join('')}
          </div>
          ${faqs.length === 0 ? '<p class="text-xs text-gray-400 mt-1">Tiada FAQ lagi. Klik "+ Tambah FAQ" untuk tambah.</p>' : ''}
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Price Ranges (optional)</label>
          <textarea id="kb-price-ranges" rows="4" placeholder='Contoh:&#10;{ "service_aircond": { "normal": "RM80-150", "chemical": "RM150-300" }, "installation": "RM350-800" }'
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm">${priceRanges ? JSON.stringify(priceRanges, null, 2) : ''}</textarea>
          <p class="text-xs text-gray-400 mt-1">JSON format. Biarkan kosong jika tidak ada.</p>
        </div>

        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-700">Objection-Response Pairs</label>
            <button type="button" onclick="addObjectionRow()" class="text-blue-600 hover:text-blue-800 text-sm font-medium">+ Tambah Objection</button>
          </div>
          <div id="objection-rows" class="space-y-3">
            ${objections.map((obj, i) => objectionRowHtml(obj, i)).join('')}
          </div>
          ${objections.length === 0 ? '<p class="text-xs text-gray-400 mt-1">Tiada objection-response lagi.</p>' : ''}
        </div>

        <div class="flex gap-3 pt-2">
          <button onclick="saveKbEditor('${clientId}', '${kbId || ''}')" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition">Simpan</button>
          <button type="button" onclick="document.getElementById('${modalId}').remove(); renderClientDetail('${clientId}')" class="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Batal</button>
        </div>
      </div>
    </div>
  </div>`;

  window.addFaqRow = addFaqRow;
  window.addObjectionRow = addObjectionRow;
}

let _faqIndex = 100;
let _objIndex = 100;

function faqRowHtml(faq, i) {
  return `
  <div class="faq-row bg-gray-50 rounded-lg p-3 border border-gray-200" data-index="${i}">
    <div class="grid grid-cols-3 gap-2 mb-2">
      <div>
        <label class="text-xs text-gray-500">Keywords (comma-separated)</label>
        <input type="text" value="${esc(faq.keywords?.join(', ') || '')}" data-keywords
          placeholder="aircond tak sejuk, tak pending"
          class="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
      </div>
      <div>
        <label class="text-xs text-gray-500">Intent</label>
        <input type="text" value="${esc(faq.intent || '')}" data-intent
          placeholder="SYMPTOM_TROUBLESHOOT"
          class="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
      </div>
      <div>
        <label class="text-xs text-gray-500">Answer</label>
        <input type="text" value="${esc(faq.answer || '')}" data-answer
          placeholder="Jawapan untuk customer..."
          class="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
      </div>
    </div>
    <button type="button" onclick="this.closest('.faq-row').remove()" class="text-red-500 hover:text-red-700 text-xs">Padam</button>
  </div>`;
}

function addFaqRow() {
  const container = document.getElementById('faq-rows');
  const i = _faqIndex++;
  container.insertAdjacentHTML('beforeend', faqRowHtml({ keywords: [], intent: '', answer: '' }, i));
}

function objectionRowHtml(obj, i) {
  return `
  <div class="objection-row bg-gray-50 rounded-lg p-3 border border-gray-200" data-index="${i}">
    <div class="grid grid-cols-2 gap-2 mb-2">
      <div>
        <label class="text-xs text-gray-500">Objection</label>
        <input type="text" value="${esc(obj.objection || '')}" data-objection
          placeholder="e.g. Mahal!"
          class="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
      </div>
      <div>
        <label class="text-xs text-gray-500">Response</label>
        <input type="text" value="${esc(obj.response || '')}" data-response
          placeholder="Jawapan untuk objection ni..."
          class="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
      </div>
    </div>
    <button type="button" onclick="this.closest('.objection-row').remove()" class="text-red-500 hover:text-red-700 text-xs">Padam</button>
  </div>`;
}

function addObjectionRow() {
  const container = document.getElementById('objection-rows');
  const i = _objIndex++;
  container.insertAdjacentHTML('beforeend', objectionRowHtml({}, i));
}

async function saveKbEditor(clientId, kbId) {
  const niche = document.getElementById('kb-niche').value.trim();
  if (!niche) { alert('Sila masukkan niche name'); return; }

  const faqRows = document.querySelectorAll('.faq-row');
  const faqs = [];
  faqRows.forEach(row => {
    const keywords = row.querySelector('[data-keywords]').value.split(',').map(k => k.trim()).filter(Boolean);
    const intent = row.querySelector('[data-intent]').value.trim();
    const answer = row.querySelector('[data-answer]').value.trim();
    if (keywords.length && intent && answer) {
      faqs.push({ keywords, intent, answer });
    }
  });

  let priceRanges = null;
  const priceText = document.getElementById('kb-price-ranges').value.trim();
  if (priceText) {
    try { priceRanges = JSON.parse(priceText); } catch { alert('Price ranges JSON tidak valid'); return; }
  }

  const objRows = document.querySelectorAll('.objection-row');
  const objections = [];
  objRows.forEach(row => {
    const objection = row.querySelector('[data-objection]').value.trim();
    const response = row.querySelector('[data-response]').value.trim();
    if (objection && response) {
      objections.push({ objection, response });
    }
  });

  const body = {
    niche,
    faq_json: JSON.stringify(faqs),
    price_ranges_json: priceRanges ? JSON.stringify(priceRanges) : null,
    objections_json: JSON.stringify(objections),
    is_active: true,
    knowledge_scope: 'shared',
  };

  if (kbId) {
    await api('PUT', `/clients/${clientId}/kb/${kbId}`, body);
  } else {
    await api('POST', `/clients/${clientId}/kb`, body);
  }

  document.getElementById('kb-editor-modal').remove();
  renderClientDetail(clientId);
}

// ─── Prompts Editor Modal ─────────────────────────────────────────────────────

function openClientPromptsEditor(clientId, promptType, currentText) {
  document.getElementById('app').innerHTML += `
  <div id="prompts-editor-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
        <h3 class="font-bold text-gray-900">Edit ${promptType === 'base' ? 'Base' : 'Fallback'} Prompt</h3>
        <button onclick="document.getElementById('prompts-editor-modal').remove(); renderClientDetail('${clientId}')" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
      </div>
      <div class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Prompt Text</label>
          <textarea id="prompt-textarea" rows="16"
            placeholder="Masukkan system prompt di sini..."
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm">${esc(currentText)}</textarea>
        </div>
        <div class="flex gap-3 pt-2">
          <button onclick="savePromptsEditor('${clientId}', '${promptType}')" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition">Simpan</button>
          <button type="button" onclick="document.getElementById('prompts-editor-modal').remove(); renderClientDetail('${clientId}')" class="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Batal</button>
        </div>
      </div>
    </div>
  </div>`;
}

async function savePromptsEditor(clientId, promptType) {
  const promptText = document.getElementById('prompt-textarea').value;
  await api('PUT', `/clients/${clientId}/prompts/${promptType}`, {
    prompt_text: promptText,
    is_active: true,
  });
  document.getElementById('prompts-editor-modal').remove();
  renderClientDetail(clientId);
}
