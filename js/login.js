document.addEventListener('DOMContentLoaded', () => {

    lucide.createIcons();

    gsap.to("#login-card", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
    });

    document.body.classList.add('dark');

    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            passwordInput.type =
                passwordInput.type === 'password' ? 'text' : 'password';

            togglePassword.innerHTML =
                passwordInput.type === 'password'
                    ? '<i data-lucide="eye"></i>'
                    : '<i data-lucide="eye-off"></i>';

            lucide.createIcons();
        });
    }

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = passwordInput.value;

        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            alert("Please register first");
            return;
        }

        const user = JSON.parse(storedUser);

        if (user.email !== email || user.password !== password) {
            alert("Invalid credentials");
            return;
        }

        user.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(user));

        // ✅ FIXED PATH
      window.location.href = 'js/dashboard.html';

    });
});
