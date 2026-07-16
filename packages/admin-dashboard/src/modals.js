// ─── Client Modal ─────────────────────────────────────────────────────────────

let _modalInjected = false;
function injectClientModal() {
  if (_modalInjected) return;
  _modalInjected = true;
  document.body.insertAdjacentHTML('beforeend', `
  <div id="client-modal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h3 class="font-bold text-gray-900" id="modal-title">Tambah Client</h3>
        <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
      </div>
      <form id="client-form" class="p-6 space-y-4">
        <input type="hidden" id="client-id" />
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
            <input type="text" id="client-company" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Subscription Status</label>
            <select id="client-status" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="trial">Trial</option><option value="active">Active</option><option value="suspended">Suspended</option><option value="cancelled">Cancelled</option>
            </select></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Tier</label>
            <select id="client-tier" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="asas">Asas</option><option value="bisnes">Bisnes</option><option value="premium">Premium</option>
            </select></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
            <input type="text" id="client-owner-name" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Owner Phone</label>
            <input type="text" id="client-owner-phone" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Owner Email</label>
            <input type="email" id="client-owner-email" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
            <select id="client-billing" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="6month">6 Month</option><option value="annual">Annual</option>
            </select></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Subscription Start</label>
            <input type="date" id="client-start" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
        </div>
        <div class="flex gap-3 pt-2">
          <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition">Simpan</button>
          <button type="button" onclick="closeModal()" class="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Batal</button>
        </div>
      </form>
    </div>
  </div>`);

  document.getElementById('client-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('client-id').value;
    const body = {
      company_name: document.getElementById('client-company').value,
      subscription_status: document.getElementById('client-status').value,
      subscription_tier: document.getElementById('client-tier').value,
      owner_name: document.getElementById('client-owner-name').value || null,
      owner_phone: document.getElementById('client-owner-phone').value || null,
      owner_email: document.getElementById('client-owner-email').value || null,
      billing_cycle: document.getElementById('client-billing').value,
      subscription_start: document.getElementById('client-start').value || null,
    };
    if (id) await api('PUT', `/clients/${id}`, body);
    else await api('POST', '/clients', body);
    closeModal();
    renderClients();
  });
}

function openClientModal(id = '') {
  injectClientModal();
  const modal = document.getElementById('client-modal');
  if (!modal) return;
  document.getElementById('modal-title').textContent = id ? 'Edit Client' : 'Tambah Client';
  document.getElementById('client-id').value = id;

  if (id) {
    api('GET', `/clients/${id}`).then(client => {
      if (client) {
        document.getElementById('client-company').value = client.company_name || '';
        document.getElementById('client-status').value = client.subscription_status || 'trial';
        document.getElementById('client-tier').value = client.subscription_tier || 'asas';
        document.getElementById('client-owner-name').value = client.owner_name || '';
        document.getElementById('client-owner-phone').value = client.owner_phone || '';
        document.getElementById('client-owner-email').value = client.owner_email || '';
        document.getElementById('client-billing').value = client.billing_cycle || 'monthly';
        document.getElementById('client-start').value = client.subscription_start || '';
      }
    });
  } else {
    document.getElementById('client-company').value = '';
    document.getElementById('client-status').value = 'trial';
    document.getElementById('client-tier').value = 'asas';
    document.getElementById('client-owner-name').value = '';
    document.getElementById('client-owner-phone').value = '';
    document.getElementById('client-owner-email').value = '';
    document.getElementById('client-billing').value = 'monthly';
    document.getElementById('client-start').value = '';
  }

  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('client-modal')?.classList.add('hidden');
}

// ─── WABA Modal ────────────────────────────────────────────────────────────────

let _wabaModalInjected = false;
function injectWabaModal() {
  if (_wabaModalInjected) return;
  _wabaModalInjected = true;
  document.body.insertAdjacentHTML('beforeend', `
  <div id="waba-modal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md">
      <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h3 class="font-bold text-gray-900">Tambah WABA</h3>
        <button onclick="closeWabaModal()" class="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
      </div>
      <form id="waba-form" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
          <input type="text" id="waba-phone" required placeholder="+60123456789" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">WABA ID</label>
          <input type="text" id="waba-id" placeholder="e.g. 727271803683109" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number ID</label>
          <input type="text" id="waba-phone-number-id" placeholder="e.g. 872026605987484" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none" />
        </div>
        <div class="flex gap-3 pt-2">
          <button type="submit" class="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-lg transition">Simpan</button>
          <button type="button" onclick="closeWabaModal()" class="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Batal</button>
        </div>
      </form>
    </div>
  </div>`);

  document.getElementById('waba-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = document.getElementById('waba-phone').value;
    const wabaId = document.getElementById('waba-id').value;
    const phoneNumberId = document.getElementById('waba-phone-number-id').value;
    await api('POST', `/wabas/clients/${window._wabaClientId}`, {
      phone_number: phone,
      waba_id: wabaId || '',
      phone_number_id: phoneNumberId || '',
      status: 'pending',
      is_default: true,
    });
    closeWabaModal();
    renderClientDetail(window._wabaClientId);
  });
}

function openWabaModal(clientId) {
  injectWabaModal();
  window._wabaClientId = clientId;
  document.getElementById('waba-phone').value = '';
  document.getElementById('waba-id').value = '';
  document.getElementById('waba-phone-number-id').value = '';
  document.getElementById('waba-modal').classList.remove('hidden');
}

function closeWabaModal() {
  document.getElementById('waba-modal')?.classList.add('hidden');
}

// ─── Shared Actions ───────────────────────────────────────────────────────────

async function toggleFeature(clientId, feature, enabled) {
  await api('PUT', `/clients/${clientId}/features`, {
    features: [{ feature, enabled: !enabled }],
  });
  renderClientDetail(clientId);
}

async function deleteClient(id) {
  if (!confirm('Padam client ini?')) return;
  await api('DELETE', `/clients/${id}`);
  renderClients();
}

function viewClient(id) {
  window.location.hash = `#/clients/${id}`;
}

function toggleSecret(btn) {
  const input = btn.previousElementSibling;
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁️';
  }
}
