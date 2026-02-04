const STORAGE_KEY = 'expenseBuddyData';

/* ---------- AUTH + USER ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !user.isLoggedIn) {
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('topNavWelcome').innerText = `Welcome back, ${user.fullName}!`;
  document.getElementById('mainWelcome').innerText = `Welcome back, ${user.fullName}!`;
  document.getElementById('pillUserName').innerText = user.fullName;
  document.getElementById('pillUserEmail').innerText = user.email;

  renderTransactions();
  populateCategoryFilter();
  lucide.createIcons();
});

/* ---------- DATA ---------- */
let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { transactions: [] };

/* ---------- FILTERS ---------- */
function populateCategoryFilter() {
  const select = document.getElementById('filterCategory');
  [...new Set(data.transactions.map(t => t.category))].forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

/* ---------- RENDER ---------- */
function renderTransactions() {
  const list = document.getElementById('transactionList');
  if (!data.transactions.length) {
    list.innerHTML = `<p class="empty">No transactions found</p>`;
    return;
  }
list.innerHTML = data.transactions.map(t => `
  <div class="transaction-row">
    <div>
      <strong>${t.title}</strong>
      <small>${t.category} • ${t.date}</small>
    </div>

    <span class="${t.type === 'expense' ? 'text-red' : 'text-green'}">
      ${t.type === 'expense' ? '-' : '+'}$${Number(t.amount).toFixed(2)}
    </span>

    <i data-lucide="trash-2" onclick="deleteTransaction(${t.id})"></i>
  </div>
`).join('');


  lucide.createIcons();
}

/* ---------- DELETE ---------- */
function deleteTransaction(id) {
  if (!confirm('Delete transaction?')) return;
  data.transactions = data.transactions.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  renderTransactions();
}
