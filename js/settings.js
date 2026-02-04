const STORAGE_KEY = "expenseBuddySettings";
const toast = document.getElementById("toast");

function showToast(msg){
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"), 2500);
}

document.addEventListener('DOMContentLoaded', () => {
    // Get logged-in user
    let storedUser = JSON.parse(localStorage.getItem('user')) || {};

    if(!storedUser || !storedUser.isLoggedIn){
        window.location.href = 'login.html';
        return;
    }

    // Unified user object
    let user = {
        fullName: storedUser.fullName || "",
        email: storedUser.email || "",
        password: storedUser.password || "",
        notificationsEnabled: storedUser.notificationsEnabled ?? true,
        darkMode: storedUser.darkMode ?? false
    };
    let lastProfile = {...user};

    // ---------- UI Initialization ----------
    document.getElementById("fullName").value = user.fullName;
    document.getElementById("email").value = user.email;
    document.getElementById("notificationsSwitch").checked = user.notificationsEnabled;
    document.getElementById("darkModeSwitch").checked = user.darkMode;
    document.body.classList.toggle("dark", user.darkMode);

    // Nav display
    ['topNavWelcome','mainWelcome'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.innerText = `Welcome back, ${user.fullName}!`;
    });
    document.getElementById('pillUserName').innerText = user.fullName;
    document.getElementById('pillUserEmail').innerText = user.email;

    // ---------- Profile Update ----------
    document.getElementById("profileForm").addEventListener("submit", e=>{
        e.preventDefault();
        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        if(!fullName || !email) return showToast("Please fill in all fields");
        lastProfile = {...user};
        user.fullName = fullName;
        user.email = email;
        storedUser.fullName = fullName;
        storedUser.email = email;
        localStorage.setItem('user', JSON.stringify(storedUser));
        showToast("Profile updated successfully!");
    });

    // ---------- Undo ----------
    document.getElementById("undoBtn").addEventListener("click", ()=>{
        user = {...lastProfile};
        document.getElementById("fullName").value = user.fullName;
        document.getElementById("email").value = user.email;
        storedUser.fullName = user.fullName;
        storedUser.email = user.email;
        localStorage.setItem('user', JSON.stringify(storedUser));
        showToast("Undo successful");
    });

    // ---------- Password Strength ----------
    const strengthFill = document.getElementById("strengthFill");
    document.getElementById("newPassword").addEventListener("input", function(){
        const val = this.value;
        let score = 0;
        if(val.length >= 6) score++;
        if(/[A-Z]/.test(val)) score++;
        if(/[0-9]/.test(val)) score++;
        if(/[^A-Za-z0-9]/.test(val)) score++;
        let width = score * 25;
        let color = ["#ef4444","#f59e0b","#10b981","#3b82f6"][Math.min(score-1,3)] || "#ef4444";
        strengthFill.style.width = width + "%";
        strengthFill.style.background = color;
    });

    // ---------- Password Update ----------
    document.getElementById("passwordForm").addEventListener("submit", function(e){
        e.preventDefault();
        const current = document.getElementById("currentPassword").value.trim();
        const newPass = document.getElementById("newPassword").value.trim();
        const confirm = document.getElementById("confirmPassword").value.trim();
        if(!current || !newPass || !confirm) return showToast("Please fill in all password fields");
        if(current !== user.password) return showToast("Current password is incorrect");
        if(newPass !== confirm) return showToast("New passwords do not match");
        if(newPass.length < 6) return showToast("Password must be at least 6 characters");
        user.password = newPass;
        storedUser.password = newPass;
        localStorage.setItem('user', JSON.stringify(storedUser));
        document.getElementById("currentPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmPassword").value = "";
        strengthFill.style.width = "0%";
        showToast("Password updated successfully!");
    });

    // ---------- Toggles ----------
    document.getElementById("notificationsSwitch").addEventListener("change", function(){
        user.notificationsEnabled = this.checked;
        storedUser.notificationsEnabled = this.checked;
        localStorage.setItem('user', JSON.stringify(storedUser));
        showToast(`Notifications ${this.checked ? "enabled" : "disabled"}`);
    });

    document.getElementById("darkModeSwitch").addEventListener("change", function(){
        user.darkMode = this.checked;
        storedUser.darkMode = this.checked;
        document.body.classList.toggle("dark", this.checked);
        localStorage.setItem('user', JSON.stringify(storedUser));
        showToast(`Dark mode ${this.checked ? "enabled" : "disabled"}`);
    });

    // ---------- Export ----------
    document.getElementById("exportBtn").addEventListener("click", function(){
        const data = JSON.stringify(user, null, 2);
        const blob = new Blob([data], {type:"application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `expense-buddy-settings-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast("Settings exported successfully!");
    });

    // ---------- Logout ----------
    document.getElementById("logoutBtn").addEventListener("click", function(){
        if(confirm("Are you sure you want to logout?")){
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem('user');
            showToast("Logged out successfully!");
            location.reload();
        }
    });
});
