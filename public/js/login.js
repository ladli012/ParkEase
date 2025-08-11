document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 🔁 Corrected: using email and password
    const email = form.email.value;
    const password = form.password.value;

    fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }) // ✅ Updated key
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          window.location.href = '/'; // ✅ Go to dashboard
        } else {
          alert(data.message);
        }
      });
  });
});
