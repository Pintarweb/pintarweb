// ─── Client Detail ────────────────────────────────────────────────────────────

async function renderClientDetail(id) {
  if (!requireAdmin()) return;
  injectClientModal();
  window._clientId = id;
  const client = await api('GET', `/clients/${id}`);
  if (!client) return;

  document.getElementById('app').innerHTML = layout(`Client: ${esc(client.company_name)}`, `
    <div class="mb-6">
      <a href="#/clients" class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
        ← Kembali ke Clients
      </a>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="flex border-b border-gray-200">
        <button onclick="switchClientTab('overview')" id="tab-overview" class="px-6 py-3 text-sm font-medium border-b-2 border-blue-600 text-blue-600">Overview</button>
        <button onclick="switchClientTab('kb')" id="tab-kb" class="px-6 py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700">Knowledge Base</button>
        <button onclick="switchClientTab('prompts')" id="tab-prompts" class="px-6 py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700">Bot Prompts</button>
      </div>
      <div id="client-tab-content" class="p-6">
        ${loadingSpinner()}
      </div>
    </div>
  `);

  await switchClientTab('overview');
}

async function switchClientTab(tab) {
  const id = window._clientId;
  const tabs = ['overview', 'kb', 'prompts'];
  tabs.forEach(t => {
    const btn = document.getElementById(`tab-${t}`);
    const isActive = t === tab;
    btn.className = `px-6 py-3 text-sm font-medium border-b-2 ${isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`;
  });

  if (tab === 'overview') await loadClientOverview(id);
  else if (tab === 'kb') await loadClientKb(id);
  else if (tab === 'prompts') await loadClientPrompts(id);
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

async function loadClientOverview(id) {
  const [features, allWabas] = await Promise.all([
    api('GET', `/clients/${id}/features`),
    api('GET', '/wabas'),
  ]);
  if (!features) return;

  const clientWabas = allWabas?.filter(w => w.client_id === id) || [];
  const client = await api('GET', `/clients/${id}`);
  if (!client) return;

  document.getElementById('client-tab-content').innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h3 class="font-bold text-gray-800 mb-4">Maklumat Client</h3>
        <dl class="space-y-3 text-sm">
          <div class="flex justify-between"><dt class="text-gray-500">Company</dt><dd class="font-medium text-gray-900">${esc(client.company_name)}</dd></div>
          <div class="flex justify-between"><dt class="text-gray-500">Status</dt><dd class="font-medium">${esc(client.subscription_status)}</dd></div>
          <div class="flex justify-between"><dt class="text-gray-500">Tier</dt><dd class="font-medium">${esc(client.subscription_tier || '—')}</dd></div>
          <div class="flex justify-between"><dt class="text-gray-500">Billing</dt><dd class="font-medium">${esc(client.billing_cycle || '—')}</dd></div>
          <div class="flex justify-between"><dt class="text-gray-500">Owner</dt><dd class="font-medium">${esc(client.owner_name || '—')}</dd></div>
          <div class="flex justify-between"><dt class="text-gray-500">Email</dt><dd class="font-medium">${esc(client.owner_email || '—')}</dd></div>
          <div class="flex justify-between"><dt class="text-gray-500">Phone</dt><dd class="font-medium">${esc(client.owner_phone || '—')}</dd></div>
          <div class="flex justify-between"><dt class="text-gray-500">Created</dt><dd class="font-medium">${client.created_at ? new Date(client.created_at).toLocaleDateString('ms-MY') : '—'}</dd></div>
        </dl>
        <button onclick="openClientModal('${id}')" class="mt-4 w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium py-2 rounded-lg text-sm transition">
          Edit Client
        </button>
      </div>

      <div class="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h3 class="font-bold text-gray-800 mb-4">Features</h3>
        ${features.length > 0 ? `
          <div class="space-y-2">
            ${features.map(f => `
              <div class="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                <span class="text-sm font-medium text-gray-700">${esc(f.feature)}</span>
                <button onclick="toggleFeature('${id}', '${f.feature}', ${!f.enabled})"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition ${f.enabled ? 'bg-green-500' : 'bg-gray-300'}">
                  <span class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${f.enabled ? 'translate-x-6' : 'translate-x-1'}"></span>
                </button>
              </div>`).join('')}
          </div>` : '<p class="text-gray-400 text-sm">Tiada features lagi</p>'}
      </div>

      <div class="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-gray-800">WABA Accounts</h3>
          <button onclick="openWabaModal('${id}')" class="text-blue-600 hover:text-blue-800 text-sm font-medium">+ Tambah</button>
        </div>
        ${clientWabas.length > 0 ? `
          <div class="space-y-2">
            ${clientWabas.map(w => `
              <div class="bg-white rounded-lg p-3 border border-gray-200">
                <div class="flex justify-between items-start">
                  <div>
                    <div class="font-medium text-sm text-gray-900">${esc(w.display_name || w.phone_number || '—')}</div>
                    <div class="text-xs text-gray-500 mt-0.5">${esc(w.phone_number || '—')}</div>
                  </div>
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${w.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">${w.status}</span>
                </div>
              </div>`).join('')}
          </div>` : '<p class="text-gray-400 text-sm">Tiada WABA lagi</p>'}
      </div>
    </div>`;
}
