// --- Configuration ---
const projectId = 'your-project-id';
const token = 'your-bearer-token';
const CATEGORIES = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 'Groceries', 'Other'];

let allExpenses = [];

// UI Elements
const tableBody = document.getElementById('expenseTableBody');
const loader = document.getElementById('loader');
const content = document.getElementById('content');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const modal = document.getElementById('editModal');

// Initialize
window.onload = () => {
    lucide.createIcons();
    populateCategoryDropdowns();
    fetchExpenses();
};

function populateCategoryDropdowns() {
    const selects = [categoryFilter, document.getElementById('edit-category')];
    CATEGORIES.forEach(cat => {
        selects.forEach(select => {
            if (select) {
                const opt = document.createElement('option');
                opt.value = cat;
                opt.textContent = cat;
                select.appendChild(opt);
            }
        });
    });
}

async function fetchExpenses() {
    try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-024654f4/expenses`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        allExpenses = data.expenses || [];
        renderExpenses();
    } catch (err) {
        console.error("Fetch error:", err);
        alert("Error fetching expenses");
    } finally {
        loader.style.display = 'none';
        content.style.display = 'block';
    }
}

function renderExpenses() {
    const term = searchInput.value.toLowerCase();
    const cat = categoryFilter.value;

    const filtered = allExpenses.filter(ex => {
        const matchesSearch = ex.title.toLowerCase().includes(term) || (ex.notes && ex.notes.toLowerCase().includes(term));
        const matchesCat = cat === 'All' || ex.category === cat;
        return matchesSearch && matchesCat;
    });

    document.getElementById('tableTitle').textContent = `All Expenses (${filtered.length})`;
    tableBody.innerHTML = '';
    
    if (filtered.length === 0) {
        document.getElementById('emptyState').style.display = 'block';
    } else {
        document.getElementById('emptyState').style.display = 'none';
        filtered.forEach(ex => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="font-weight: 500;">${ex.title}</td>
                <td class="amount-cell">$${ex.amount.toFixed(2)}</td>
                <td><span class="cat-badge">${ex.category}</span></td>
                <td>${new Date(ex.date).toLocaleDateString()}</td>
                <td style="text-align: right;">
                    <button class="btn btn-ghost" onclick="openEditModal('${ex.id}')"><i data-lucide="pencil" style="width:16px"></i></button>
                    <button class="btn btn-ghost" onclick="deleteExpense('${ex.id}')"><i data-lucide="trash-2" style="width:16px; color:red"></i></button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    lucide.createIcons();
}

// Event Listeners
searchInput.addEventListener('input', renderExpenses);
categoryFilter.addEventListener('change', renderExpenses);

async function deleteExpense(id) {
    if (!confirm("Are you sure?")) return;
    try {
        await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-024654f4/expenses/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        allExpenses = allExpenses.filter(e => e.id !== id);
        renderExpenses();
    } catch (err) { alert("Delete failed"); }
}

function openEditModal(id) {
    const ex = allExpenses.find(e => e.id === id);
    document.getElementById('edit-id').value = ex.id;
    document.getElementById('edit-title').value = ex.title;
    document.getElementById('edit-amount').value = ex.amount;
    document.getElementById('edit-category').value = ex.category;
    document.getElementById('edit-date').value = ex.date.split('T')[0];
    document.getElementById('edit-notes').value = ex.notes || '';
    modal.style.display = 'flex';
}

function closeModal() { modal.style.display = 'none'; }

document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const updated = {
        title: document.getElementById('edit-title').value,
        amount: parseFloat(document.getElementById('edit-amount').value),
        category: document.getElementById('edit-category').value,
        date: document.getElementById('edit-date').value,
        notes: document.getElementById('edit-notes').value
    };

    try {
        await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-024654f4/expenses/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(updated)
        });
        allExpenses = allExpenses.map(e => e.id === id ? { ...e, ...updated } : e);
        renderExpenses();
        closeModal();
    } catch (err) { alert("Update failed"); }
});