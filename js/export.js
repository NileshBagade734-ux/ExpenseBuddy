// SAMPLE DATA
const transactions = [
  { date: "2025-02-01", time: "10:30", type: "expense", category: "Food", amount: 250, notes: "Lunch" },
  { date: "2025-02-02", time: "09:00", type: "income", category: "Salary", amount: 30000, notes: "Monthly salary" },
  { date: "2025-02-03", time: "18:00", type: "expense", category: "Transport", amount: 120, notes: "Auto" }
];

// ELEMENTS
const toastEl = document.getElementById("toast");
const exportBtn = document.getElementById("exportBtn");

// TOAST
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  setTimeout(() => toastEl.classList.remove("show"), 2500);
}

// FILTER DATA
function getFilteredData() {
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;
  const category = document.getElementById("category").value;

  return transactions.filter(t => {
    if (start && new Date(t.date) < new Date(start)) return false;
    if (end && new Date(t.date) > new Date(end)) return false;
    if (category !== "all" && t.category !== category) return false;
    return true;
  });
}

// UPDATE PREVIEW
function updatePreview() {
  document.getElementById("count").innerText = getFilteredData().length;
}

// LISTEN FOR FILTER CHANGES
document.querySelectorAll("select,input").forEach(el => el.addEventListener("change", updatePreview));

updatePreview();

// EXPORT HANDLER
function handleExport() {
  const format = document.getElementById("format").value;
  const data = getFilteredData();

  if (data.length === 0) {
    showToast("No transactions to export");
    return;
  }

  if (format === "csv") exportCSV(data);
  else exportHTML(data);
}

// CSV EXPORT
function exportCSV(data) {
  const headers = ["Date","Time","Type","Category","Amount","Notes"];
  const rows = data.map(t =>
    [t.date,t.time,t.type,t.category,t.amount,`"${t.notes}"`].join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "expense-buddy.csv";
  a.click();

  showToast("CSV exported successfully");
}

// HTML EXPORT
function exportHTML(data) {
  const rows = data.map(t => `
    <tr>
      <td>${t.date}</td>
      <td>${t.time}</td>
      <td>${t.type}</td>
      <td>${t.category}</td>
      <td>${t.amount}</td>
      <td>${t.notes}</td>
    </tr>
  `).join("");

  const html = `
    <html>
    <head>
      <title>Expense Report</title>
      <style>
        body{font-family:Arial;padding:30px}
        table{width:100%;border-collapse:collapse}
        th,td{border-bottom:1px solid #ddd;padding:10px}
        th{background:#f3f4f6}
      </style>
    </head>
    <body>
      <h2>Expense Buddy Report</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th><th>Time</th><th>Type</th><th>Category</th><th>Amount</th><th>Notes</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "expense-report.html";
  a.click();

  showToast("HTML report generated");
}

// BUTTON CLICK
exportBtn.addEventListener("click", handleExport);
