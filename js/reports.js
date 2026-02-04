document.addEventListener('DOMContentLoaded', () => {

  /* ---------- LOAD DATA ---------- */
  const store = JSON.parse(localStorage.getItem('expenseBuddyData')) || { transactions: [] };
  const transactions = store.transactions;

  if (!transactions || !transactions.length) return;

  /* ---------- FILTER ---------- */
  const incomeTx = transactions.filter(t => t.type === 'income');
  const expenseTx = transactions.filter(t => t.type === 'expense');

  /* ---------- TOTALS ---------- */
  const totalIncome = incomeTx.reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = expenseTx.reduce((s, t) => s + Number(t.amount), 0);

  document.getElementById('totalIncome').innerText = `$${totalIncome.toFixed(2)}`;
  document.getElementById('totalExpense').innerText = `$${totalExpense.toFixed(2)}`;
  document.getElementById('avgIncome').innerText =
    `$${(incomeTx.length ? totalIncome / incomeTx.length : 0).toFixed(2)}`;
  document.getElementById('avgExpense').innerText =
    `$${(expenseTx.length ? totalExpense / expenseTx.length : 0).toFixed(2)}`;

  /* ---------- MONTHLY DATA ---------- */
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthlyIncome = Array(12).fill(0);
  const monthlyExpense = Array(12).fill(0);

  transactions.forEach(t => {
    const d = new Date(t.date);
    if (isNaN(d)) return;

    const m = d.getMonth();
    if (t.type === 'income') monthlyIncome[m] += Number(t.amount);
    if (t.type === 'expense') monthlyExpense[m] += Number(t.amount);
  });

  /* ---------- LINE CHART (Income GREEN, Expense RED) ---------- */
  new Chart(lineChart, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: monthlyIncome,
          borderColor: '#10b981',                 // 🟢 GREEN
          backgroundColor: 'rgba(16,185,129,0.15)',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 4
        },
        {
          label: 'Expense',
          data: monthlyExpense,
          borderColor: '#ef4444',                 // 🔴 RED
          backgroundColor: 'rgba(239,68,68,0.15)',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          ticks: { color: '#64748b' },
          grid: { color: '#e2e8f0' }
        },
        x: {
          ticks: { color: '#64748b' },
          grid: { display: false }
        }
      }
    }
  });

  /* ---------- CATEGORY TOTALS (EXPENSE ONLY) ---------- */
  const categoryTotals = {};
  expenseTx.forEach(t => {
    categoryTotals[t.category] =
      (categoryTotals[t.category] || 0) + Number(t.amount);
  });

  const labels = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);

  if (!labels.length) return;

  /* ---------- PIE CHART (Expense = RED SHADES) ---------- */
  new Chart(pieChart, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: labels.map((_, i) =>
          `hsl(0, 75%, ${55 + i * 4}%)`   // 🔴 red shades
        ),
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#0f172a' }
        }
      }
    }
  });

  /* ---------- BAR CHART (Expense = RED) ---------- */
  new Chart(barChart, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Expenses',
        data: values,
        backgroundColor: '#ef4444',     // 🔴 RED
        borderRadius: 8,
        barThickness: 40
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          ticks: { color: '#64748b' },
          grid: { color: '#e2e8f0' }
        },
        x: {
          ticks: { color: '#64748b' },
          grid: { display: false }
        }
      }
    }
  });

});
