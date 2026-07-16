function layout(title, content) {
  return `
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-900 text-white flex flex-col">
      <div class="p-6 border-b border-gray-700">
        <h1 class="text-xl font-bold text-blue-400">PintarWeb Admin</h1>
        <p class="text-xs text-gray-400 mt-1">Dashboard Pengurusan</p>
      </div>
      <nav class="flex-1 p-4 space-y-1">
        <a href="#/" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition text-gray-300 hover:text-white">
          <span>📊</span><span>Dashboard</span>
        </a>
        <a href="#/clients" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition text-gray-300 hover:text-white">
          <span>👥</span><span>Clients</span>
        </a>
        <a href="#/wabas" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition text-gray-300 hover:text-white">
          <span>📱</span><span>WABA Accounts</span>
        </a>
      </nav>
      <div class="p-4 border-t border-gray-700">
        <button onclick="logout()" class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition text-gray-400 hover:text-white text-sm">
          <span>🚪</span><span>Logout</span>
        </button>
      </div>
    </aside>
    <!-- Main -->
    <main class="flex-1 p-6 overflow-auto">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">${title}</h2>
      </div>
      ${content}
    </main>
  </div>`;
}

function statCard(label, value, icon, color) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
  };
  return `<div class="bg-white rounded-xl border ${colors[color] || colors.blue} p-6">
    <div class="flex items-center gap-4">
      <span class="text-3xl">${icon}</span>
      <div>
        <p class="text-sm opacity-80">${label}</p>
        <p class="text-2xl font-bold">${value ?? 0}</p>
      </div>
    </div>
  </div>`;
}
