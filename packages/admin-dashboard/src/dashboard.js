// ─── Login ────────────────────────────────────────────────────────────────────

function renderLogin() {
  if (token) { window.location.hash = '#/'; return; }
  document.getElementById('app').innerHTML = `
  <div class="min-h-screen bg-gray-900 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
      <div class="text-center mb-8">
        <div class="text-4xl mb-3">🔐</div>
        <h1 class="text-xl font-bold text-gray-900">PintarWeb Admin</h1>
        <p class="text-sm text-gray-500 mt-1">Masukkan password untuk continue</p>
      </div>
      <form id="login-form" class="space-y-4">
        <div>
          <input type="password" id="login-password" placeholder="Password" required
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-center text-lg tracking-widest" />
        </div>
        <div id="login-error" class="hidden text-red-600 text-sm text-center">Password salah. Cuba lagi.</div>
        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">
          Masuk
        </button>
      </form>
      <p class="text-center text-xs text-gray-400 mt-6">Hint: admin123</p>
    </div>
  </div>`;

  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const pw = document.getElementById('login-password').value;
    if (login(pw)) {
      // success — reload
    } else {
      document.getElementById('login-error').classList.remove('hidden');
      document.getElementById('login-password').value = '';
    }
  });
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

async function renderDashboard() {
  if (!requireAdmin()) return;
  const data = await api('GET', '/stats');
  if (!data) return;

  document.getElementById('app').innerHTML = layout('Dashboard', `
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      ${statCard('Jumlah Client', data.totalClients, '🏢', 'blue')}
      ${statCard('Client Aktif', data.activeClients, '✅', 'green')}
      ${statCard('WABA Accounts', data.totalWabas, '📱', 'purple')}
      ${statCard('Total Conversations', data.totalConversations, '💬', 'orange')}
    </div>
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <h2 class="text-lg font-bold text-gray-800 mb-4">Pengurusan Pantas</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <a href="#/clients" class="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl transition text-center">
          <span class="text-2xl">👥</span>
          <span class="text-sm font-medium text-gray-700">Clients</span>
        </a>
        <a href="#/wabas" class="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-xl transition text-center">
          <span class="text-2xl">📱</span>
          <span class="text-sm font-medium text-gray-700">WABA Accounts</span>
        </a>
        <a href="#/clients" onclick="injectClientModal();openClientModal();return false;" class="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-xl transition text-center">
          <span class="text-2xl">➕</span>
          <span class="text-sm font-medium text-gray-700">Tambah Client</span>
        </a>
      </div>
    </div>
  `);
}

// ─── Clients ─────────────────────────────────────────────────────────────────

async function renderClients() {
  if (!requireAdmin()) return;
  injectClientModal();
  const clients = await api('GET', '/clients');
  if (!clients) return;

  document.getElementById('app').innerHTML = layout('Clients', `
    <div class="flex justify-between items-center mb-4">
      <p class="text-gray-600">${clients.length} client(s)</p>
      <button onclick="openClientModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
        + Tambah Client
      </button>
    </div>
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          ${clients.map(c => `
          <tr class="hover:bg-gray-50">
            <td class="px-4 py-3">
              <a href="#/clients/${c.id}" class="text-blue-600 hover:text-blue-800 font-medium">${esc(c.company_name)}</a>
            </td>
            <td class="px-4 py-3">
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                c.subscription_status === 'active' ? 'bg-green-100 text-green-700' :
                c.subscription_status === 'trial' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
              }">${esc(c.subscription_status)}</span>
            </td>
            <td class="px-4 py-3 text-gray-600">${esc(c.subscription_tier || '—')}</td>
            <td class="px-4 py-3 text-gray-600">${esc(c.owner_name || '—')}</td>
            <td class="px-4 py-3 text-right">
              <a href="#/clients/${c.id}" class="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">Edit</a>
              <button onclick="deleteClient('${c.id}')" class="text-red-600 hover:text-red-800 text-sm font-medium">Padam</button>
            </td>
          </tr>`).join('')}
          ${clients.length === 0 ? `<tr><td colspan="5" class="px-4 py-8 text-center text-gray-400">Tiada client lagi</td></tr>` : ''}
        </tbody>
      </table>
    </div>
  `);
}

// ─── WABAs ───────────────────────────────────────────────────────────────────

async function renderWabas() {
  if (!requireAdmin()) return;
  injectWabaModal();
  const wabas = await api('GET', '/wabas');
  if (!wabas) return;

  document.getElementById('app').innerHTML = layout('WABA Accounts', `
    <div class="flex justify-between items-center mb-4">
      <p class="text-gray-600">${wabas.length} WABA(s)</p>
    </div>
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Display Name</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">WABA ID</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone Number ID</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          ${wabas.map(w => `
          <tr class="hover:bg-gray-50">
            <td class="px-4 py-3 font-medium text-gray-900">${esc(w.phone_number || '—')}</td>
            <td class="px-4 py-3 text-gray-600">${esc(w.display_name || '—')}</td>
            <td class="px-4 py-3 text-gray-600 font-mono text-xs">${esc(w.waba_id || '—')}</td>
            <td class="px-4 py-3 text-gray-600 font-mono text-xs">${esc(w.phone_number_id || '—')}</td>
            <td class="px-4 py-3">
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${w.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">${w.status}</span>
            </td>
          </tr>`).join('')}
          ${wabas.length === 0 ? `<tr><td colspan="5" class="px-4 py-8 text-center text-gray-400">Tiada WABA lagi</td></tr>` : ''}
        </tbody>
      </table>
    </div>
  `);
}
