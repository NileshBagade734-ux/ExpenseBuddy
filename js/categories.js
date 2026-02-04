let categories = [];

function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerText = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

function addCategory() {
  const name = nameInput.value.trim();
  const type = typeInput.value;
  const color = colorInput.value;

  if (!name) {
    toast('Please enter category name');
    return;
  }

  if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
    toast('Category already exists');
    return;
  }

  categories.push({
    id: Date.now(),
    name,
    type,
    color
  });

  nameInput.value = '';
  typeInput.value = 'expense';
  colorInput.value = '#3B82F6';

  toast('Category added');
  render();
}

function deleteCategory(id) {
  if (!confirm('Delete this category?')) return;
  categories = categories.filter(c => c.id !== id);
  toast('Category deleted');
  render();
}

function render() {
  expenseList.innerHTML = '';
  incomeList.innerHTML = '';

  categories.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'category-card';

    card.innerHTML = `
      <div class="cat-left">
        <div class="color-box" style="background:${cat.color}20;color:${cat.color}">
          🎨
        </div>
        <div>
          <div class="cat-name">${cat.name}</div>
          <div class="cat-type">${cat.type}</div>
        </div>
      </div>
      <button class="delete-btn" onclick="deleteCategory(${cat.id})">🗑️</button>
    `;

    if (cat.type === 'expense' || cat.type === 'both') {
      expenseList.appendChild(card.cloneNode(true));
    }

    if (cat.type === 'income' || cat.type === 'both') {
      incomeList.appendChild(card);
    }
  });
}
