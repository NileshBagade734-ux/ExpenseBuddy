/* ---------- Categories ---------- */
const expenseCategories = ["Food & Dining","Transportation","Shopping","Entertainment","Bills & Utilities","Groceries","Rent","Healthcare","Other"];
const incomeCategories = ["Salary","Freelancing","Internship / Stipend","Business Income","Part-Time Job","Bonus","Commission","Investments","Other Income"];

/* ---------- AUTH & INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
    let user = JSON.parse(localStorage.getItem('user'));
    if(!user){
        user={fullName:"Test User",email:"test@example.com",isLoggedIn:true};
        localStorage.setItem('user',JSON.stringify(user));
    }
    document.getElementById('mainWelcome').innerText=`Welcome back, ${user.fullName}!`;
    document.getElementById('pillUserName').innerText=user.fullName;
    document.getElementById('pillUserEmail').innerText=user.email;

    const now=new Date();
    document.getElementById('date').value=now.toISOString().split('T')[0];
    document.getElementById('time').value=now.toTimeString().slice(0,5);

    setType('expense');
    lucide.createIcons();
});

/* ---------- Type toggle ---------- */
function setType(type){
    document.getElementById('type').value=type;
    document.getElementById('btnExpense').classList.toggle('active', type==='expense');
    document.getElementById('btnIncome').classList.toggle('active', type==='income');

    const categorySelect=document.getElementById('category');
    categorySelect.innerHTML=`<option value="" disabled selected>Select a category</option>`;
    const list=type==='income'?incomeCategories:expenseCategories;
    list.forEach(cat=>{const opt=document.createElement('option');opt.value=cat;opt.textContent=cat;categorySelect.appendChild(opt);});
}

/* ---------- Form Submit ---------- */
document.getElementById('transactionForm').addEventListener('submit',(e)=>{
    e.preventDefault();
    const title=document.getElementById('desc').value.trim();
    const amount=parseFloat(document.getElementById('amt').value);
    const category=document.getElementById('category').value;
    const type=document.getElementById('type').value;
    const date=document.getElementById('date').value;
    const time=document.getElementById('time').value;
    const notes=document.getElementById('notes').value;

    if(!title||isNaN(amount)||amount<=0||!category){
        alert("Please fill all required fields correctly."); return;
    }

    const newTransaction={id:Date.now(),title,amount,category,type,date,time,notes,createdAt:new Date().toISOString()};
    const data=JSON.parse(localStorage.getItem('expenseBuddyData'))||{transactions:[]};
    data.transactions.unshift(newTransaction);
    localStorage.setItem('expenseBuddyData',JSON.stringify(data));

    alert("Transaction added successfully!");
    window.location.href='dashboard.html';
});

/* ---------- Reset Form ---------- */
function resetForm(){
    document.getElementById('transactionForm').reset();
    setType('expense');
    const now=new Date();
    document.getElementById('date').value=now.toISOString().split('T')[0];
    document.getElementById('time').value=now.toTimeString().slice(0,5);
}

/* ---------- Logout ---------- */
function logout(){
    localStorage.removeItem('user');
    window.location.href='login.html';
}