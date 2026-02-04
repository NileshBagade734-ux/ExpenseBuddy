/* ---------- STORAGE ---------- */
let categories = JSON.parse(localStorage.getItem("categories")) || [];
let budgets = JSON.parse(localStorage.getItem("budgets")) || [];
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

/* ---------- UTIL ---------- */
const toast = msg => {
  const t=document.getElementById("toast");
  t.textContent=msg;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2500);
};

/* ---------- CATEGORY ---------- */
function addCategory(){
  const name=document.getElementById("catName").value.trim();
  const color=document.getElementById("catColor").value;
  if(!name) return toast("Enter category name");
  categories.push({name,color});
  localStorage.setItem("categories",JSON.stringify(categories));
  document.getElementById("catName").value="";
  render();
  toast("Category added");
}

/* ---------- BUDGET ---------- */
function setBudget(){
  const cat=document.getElementById("budgetCategory").value;
  const amt=+document.getElementById("budgetAmount").value;
  if(!cat||amt<=0) return toast("Invalid budget");
  const b=budgets.find(b=>b.category===cat);
  b ? b.limit=amt : budgets.push({category:cat,limit:amt});
  localStorage.setItem("budgets",JSON.stringify(budgets));
  toast("Budget saved");
  render();
}

/* ---------- TRANSACTION ---------- */
function addTransaction(){
  const tx={
    note:document.getElementById("txNote").value,
    amount:+document.getElementById("txAmount").value,
    category:document.getElementById("txCategory").value,
    date:document.getElementById("txDate").value||new Date().toISOString()
  };
  if(!tx.amount||!tx.category) return toast("Missing fields");
  transactions.push(tx);
  localStorage.setItem("transactions",JSON.stringify(transactions));
  document.getElementById("txNote").value="";
  document.getElementById("txAmount").value="";
  toast("Expense added");
  render();
}

/* ---------- SMART SUGGEST ---------- */
function autoSuggest(){
  const note=document.getElementById("txNote").value.toLowerCase();
  const map={
    food:["swiggy","zomato","restaurant"],
    transport:["uber","ola","bus","metro"],
    shopping:["amazon","flipkart"]
  };
  for(const c in map){
    if(map[c].some(k=>note.includes(k))){
      document.getElementById("txCategory").value=c;
      document.getElementById("suggestion").textContent=`Suggested category: ${c}`;
      return;
    }
  }
  document.getElementById("suggestion").textContent="";
}

/* ---------- SUMMARY + ALERTS ---------- */
function render(){
  const budgetCategory=document.getElementById("budgetCategory");
  const txCategory=document.getElementById("txCategory");
  const summary=document.getElementById("summary");

  budgetCategory.innerHTML=txCategory.innerHTML="";
  categories.forEach(c=>{
    budgetCategory.innerHTML+=`<option>${c.name}</option>`;
    txCategory.innerHTML+=`<option>${c.name}</option>`;
  });

  let html="";
  budgets.forEach(b=>{
    const spent=transactions
      .filter(t=>t.category===b.category)
      .reduce((s,t)=>s+t.amount,0);

    const pct=Math.round(spent/b.limit*100);
    let cls="good",text="On track";
    if(pct>=100){cls="danger";text="Exceeded";}
    else if(pct>=80){cls="warn";text="Warning";}

    if(pct>=80) toast(`${b.category} budget ${text}`);

    const days=new Date().getDate();
    const burn=Math.round((spent/days)*(30-days));

    html+=`
      <p>
        <strong>${b.category}</strong> — ₹${spent} / ₹${b.limit}
        <span class="badge ${cls}">${text}</span><br/>
        <span class="small">At this pace, you may overspend by ₹${burn}</span>
      </p>`;
  });
  summary.innerHTML=html||"No budgets yet";
}
render();
