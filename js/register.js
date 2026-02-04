lucide.createIcons();

document.addEventListener('DOMContentLoaded', () => {
    gsap.to("#register-card", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
    });

    document.body.classList.add('dark');
});

// Password toggle
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', () => {
    passwordInput.type =
        passwordInput.type === 'password' ? 'text' : 'password';

    togglePassword.innerHTML =
        passwordInput.type === 'password'
            ? '<i data-lucide="eye"></i>'
            : '<i data-lucide="eye-off"></i>';

    lucide.createIcons();
});

// Register form
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = passwordInput.value;

    if (!fullName || !email || password.length < 8) {
        alert("Fill all fields correctly");
        return;
    }

    const userData = {
        id: Date.now(),
        fullName,
        email,
        password, // (mock only)
        isLoggedIn: true
    };

    localStorage.setItem('user', JSON.stringify(userData));
    window.location.href = 'dashboard.html';
});
