const API_BASE = 'https://pintarweb-whatsapp-bot.yusmarin.workers.dev/admin/api';
let token = localStorage.getItem('pw_admin_token') || null;

function esc(str) {
  if (str == null) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function api(method, path, body) {
  const res = await fetch(API_BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (res.status === 401) {
    token = null;
    localStorage.removeItem('pw_admin_token');
    window.location.reload();
    return null;
  }
  if (!res.ok) {
    console.error('API error:', res.status, await res.text());
    return null;
  }
  if (res.status === 204) return {};
  return res.json();
}

function requireAdmin() {
  if (!token) {
    window.location.hash = '#/login';
    return false;
  }
  return true;
}

function login(password) {
  if (password === 'admin123') {
    token = 'admin123';
    localStorage.setItem('pw_admin_token', token);
    window.location.hash = '#/';
    return true;
  }
  return false;
}

function logout() {
  token = null;
  localStorage.removeItem('pw_admin_token');
  window.location.hash = '#/login';
}

function loadingSpinner() {
  return '<div class="flex justify-center py-12"><div class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>';
}
