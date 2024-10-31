
let users = JSON.parse(localStorage.getItem('users')) || [];
let loggedInUser = null;



// Sign up form
document.getElementById('register-btn').addEventListener('click', function() {
    showAuthForm('register');
});

document.getElementById('to-register-btn').addEventListener('click', function() {
    showAuthForm('register');
});

function showAuthForm(mode) {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('auth-container').style.display = 'block';

    if (mode === 'register') {
        document.getElementById('form-title').textContent = 'Sign up';
        document.getElementById('submit-btn').textContent = 'Submit';
        document.getElementById('to-register-btn').style.display = 'none';
        document.getElementById('to-login-btn').style.display = 'block';
    }
}

document.getElementById('user-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (document.getElementById('submit-btn').textContent === 'Submit') {
        await createUser(username, password);
    }

    document.getElementById('user-form').reset();
});

async function createUser(username, password) {
    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message);
            showAuthForm('login');
        } else {
            const error = await response.json();
            alert(error.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

