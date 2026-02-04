
lucide.createIcons();

let goals = JSON.parse(localStorage.getItem('goals')) || [];
let editingId = null;

const grid = document.getElementById('goalsGrid');
const modal = document.getElementById('goalModal');

function daysRemaining(date) {
  return Math.ceil((new Date(date) - new Date()) / 86400000);
}

function render() {
  grid.innerHTML = '';

  if (!goals.length) {
    grid.innerHTML = `
      <div class="card" style="text-align:center">
        <i data-lucide="target"></i>
        <p class="muted">No financial goals yet</p>
      </div>`;
    lucide.createIcons();
    return;
  }

  goals.forEach(goal => {
    const percent = (goal.current / goal.target) * 100;
    const done = percent >= 100;
    const days = daysRemaining(goal.deadline);

    grid.innerHTML += `
      <div class="card">
        <div class="goal-header">
          <div style="display:flex; gap:12px">
            <div class="icon-box ${done ? 'green' : 'blue'}" style="background:${done?'#10b98122':'#3b82f622'}">
              <i data-lucide="${done?'trending-up':'target'}"></i>
            </div>
            <div>
              <strong>${goal.title}</strong>
              <div class="muted">
                ${done ? 'Completed' : days < 0 ? `${Math.abs(days)} days overdue` : `${days} days remaining`}
              </div>
            </div>
          </div>
          <div>
            <button class="btn-ghost" onclick="editGoal('${goal.id}')"><i data-lucide="pencil"></i></button>
            <button class="btn-ghost btn-danger" onclick="deleteGoal('${goal.id}')"><i data-lucide="trash-2"></i></button>
          </div>
        </div>

        <div class="muted">$${goal.current} / $${goal.target}</div>
        <div class="progress">
          <span style="width:${Math.min(percent,100)}%; background:${done?'#10b981':'#3b82f6'}"></span>
        </div>

        ${!done ? `<button class="btn btn-green" onclick="addFunds('${goal.id}')">
          <i data-lucide="plus"></i> Add Funds
        </button>` : ''}
      </div>
    `;
  });

  lucide.createIcons();
}

function openModal() {
  modal.classList.add('active');
}

function closeModal() {
  modal.classList.remove('active');
  editingId = null;
  document.querySelectorAll('input').forEach(i => i.value = '');
}

function saveGoal() {
  const title = titleInput.value;
  const target = +targetInput.value;
  const current = +currentInput.value || 0;
  const deadline = deadlineInput.value;

  if (!title || !target || !deadline) return alert('Fill all required fields');

  if (editingId) {
    Object.assign(goals.find(g => g.id === editingId), { title, target, current, deadline });
  } else {
    goals.push({ id: Date.now().toString(), title, target, current, deadline });
  }

  localStorage.setItem('goals', JSON.stringify(goals));
  closeModal();
  render();
}

function editGoal(id) {
  const g = goals.find(x => x.id === id);
  editingId = id;
  modal.classList.add('active');
  modalTitle.innerText = 'Edit Goal';
  titleInput.value = g.title;
  targetInput.value = g.target;
  currentInput.value = g.current;
  deadlineInput.value = g.deadline;
}

function deleteGoal(id) {
  if (confirm('Delete this goal?')) {
    goals = goals.filter(g => g.id !== id);
    localStorage.setItem('goals', JSON.stringify(goals));
    render();
  }
}

function addFunds(id) {
  const amount = prompt('Enter amount');
  if (!amount) return;
  const g = goals.find(x => x.id === id);
  g.current += +amount;
  localStorage.setItem('goals', JSON.stringify(goals));
  render();
}

render();