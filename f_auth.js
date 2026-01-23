// Обработка отправки формы входа
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        // Сохраняем токен и переходим на дашборд
        localStorage.setItem('token', data.token);
        window.location.href = 'dashboard.html';
      } else {
        errorEl.textContent = data.message || 'Login failed';
      }
    } catch (err) {
      errorEl.textContent = 'An error occurred';
      console.error(err);
    }
  });
}

// Обработка отправки формы регистрации
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const errorEl = document.getElementById('signup-error');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        // Перенаправляем на страницу входа
        window.location.href = 'index.html';
      } else {
        errorEl.textContent = data.message || 'Sign up failed';
      }
    } catch (err) {
      errorEl.textContent = 'An error occurred';
      console.error(err);
    }
  });
}
