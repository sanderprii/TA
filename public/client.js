// client.js
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                    window.location.href = '/login';
                } else {
                    alert(result.error);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                    window.location.href = '/'; // Suuna home lehele
                } else {
                    alert(result.error);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }

    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', async function () {
            try {
                const response = await fetch('/api/logout', { method: 'POST' });
                if (response.ok) {
                    alert('Logged out successfully');
                    window.location.href = '/login'; // Suuna tagasi login lehele
                } else {
                    alert('Logout failed');
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }
});
