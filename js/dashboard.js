//* ---------- STATE ---------- */
const STORAGE_KEY = 'expenseBuddyData';

let state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    transactions: []
};

/* ---------- AUTH CHECK & INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    ['topNavWelcome', 'mainWelcome'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = `Welcome back, ${user.fullName}!`;
    });

    document.getElementById('pillUserName').innerText = user.fullName;
    document.getElementById('pillUserEmail').innerText = user.email;

    render();
});

/* ---------- MODAL ---------- */
function openModal(type = 'income') {
    document.getElementById('type').value = type;
    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

/* ---------- TRANSACTIONS ---------- */
function saveData() {
    const title = document.getElementById('desc').value.trim();
    const amount = parseFloat(document.getElementById('amt').value);
    const type = document.getElementById('type').value;

    if (!title || isNaN(amount) || amount <= 0) {
        alert("Please enter valid data");
        return;
    }

    state.transactions.unshift({
        id: Date.now(),
        title,
        amount,
        type,
        category: "General",
        date: new Date().toISOString().split('T')[0]
    });

    persist();
    document.getElementById('desc').value = '';
    document.getElementById('amt').value = '';
    closeModal();
}

function deleteItem(id) {
    state.transactions = state.transactions.filter(t => t.id !== id);
    persist();
}

function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    render();
}

/* ---------- UI RENDER ---------- */
function render() {
    const income = state.transactions
        .filter(t => t.type === 'income')
        .reduce((s, t) => s + t.amount, 0);

    const expense = state.transactions
        .filter(t => t.type === 'expense')
        .reduce((s, t) => s + t.amount, 0);

    document.getElementById('totalInc').innerText = `$${income.toFixed(2)}`;
    document.getElementById('totalExp').innerText = `$${expense.toFixed(2)}`;
    document.getElementById('totalBal').innerText = `$${(income - expense).toFixed(2)}`;

    const display = document.getElementById('transDisplay');

    if (!state.transactions.length) {
        display.innerHTML = `
            <div class="empty-state">
                <p>No transactions yet</p>
                <button onclick="openModal()">Add Transaction</button>
            </div>`;
    } else {
        display.innerHTML = state.transactions.map(t => `
            <div class="transaction-row">
                <div>
                    <strong>${t.title}</strong>
                    <small>${t.category} • ${t.date}</small>
                </div>
                <span class="${t.type === 'expense' ? 'text-red' : 'text-green'}">
                    ${t.type === 'expense' ? '-' : '+'}$${t.amount.toFixed(2)}
                </span>
                <i data-lucide="trash-2" onclick="deleteItem(${t.id})"></i>
            </div>
        `).join('');
    }

    lucide.createIcons();
}

/* ---------- LOGOUT ---------- */
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}
