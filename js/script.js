let user = null;
let authMode = 'login';

function toggleAuthMode() {
    authMode = authMode === 'login' ? 'signup' : 'login';

    const nameField = document.getElementById('nameGroup');
    const title = document.getElementById('authTitle');
    const switchText = document.getElementById('authSwitchText');

    if (authMode === 'signup') {
        nameField.classList.remove('hidden');
        title.textContent = 'Create Account';
        switchText.textContent = 'Already have an account?';
    } else {
        nameField.classList.add('hidden');
        title.textContent = 'Login';
        switchText.textContent = 'Need an account?';
    }

    clearErrors();
}

function clearErrors() {
    if (document.getElementById('nameError')) document.getElementById('nameError').style.display = 'none';
    if (document.getElementById('emailError')) document.getElementById('emailError').style.display = 'none';
    if (document.getElementById('passwordError')) document.getElementById('passwordError').style.display = 'none';
}

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function validatePassword(password) {
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    const isLongEnough = password.length >= 8;
    return hasSpecialChar && isLongEnough;
}

function handleAuth() {
    clearErrors();

    const name = document.getElementById('name') ? document.getElementById('name').value : "";
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    let isValid = true;

    if (authMode === 'signup' && !name.trim()) {
        document.getElementById('nameError').textContent = 'Please enter your full name';
        document.getElementById('nameError').style.display = 'block';
        isValid = false;
    }

    if (!email.trim()) {
        document.getElementById('emailError').textContent = 'Please enter your email';
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    } else if (!validateEmail(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address';
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    }

    if (!password) {
        document.getElementById('passwordError').textContent = 'Please enter your password';
        document.getElementById('passwordError').style.display = 'block';
        isValid = false;
    } else if (!validatePassword(password)) {
        document.getElementById('passwordError').textContent = 'Password must be at least 8 characters with one special character (!@#$%^&*)';
        document.getElementById('passwordError').style.display = 'block';
        isValid = false;
    }

    if (!isValid) return;

    if (authMode === 'signup') {
        user = { name: name, email: email };
    } else {
        user = { name: email.split('@')[0], email: email };
    }

    // Save user in localStorage (so it works across pages)
    localStorage.setItem("healthfitUser", JSON.stringify(user));

    window.location.href = "index.html";
}

function logout() {
    user = null;
    localStorage.removeItem("healthfitUser");
    window.location.href = "index.html";
}

// Load user if already logged in
function loadUser() {
    const saved = localStorage.getItem("healthfitUser");
    if (saved) {
        user = JSON.parse(saved);

        const userSection = document.getElementById('userSection');
        if (userSection) {
            userSection.innerHTML =
                '<span style="color: #ff6600;">Hi, ' + user.name + '</span> ' +
                '<button class="btn-primary" onclick="logout()">Logout</button>';
        }

        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) {
            welcomeMessage.textContent = 'Welcome back, ' + user.name + '!';
            welcomeMessage.style.display = 'block';
        }
    }
}

/* BMI COLOR BASED RESULTS */
function calculateBMI() {
    const heightCm = parseFloat(document.getElementById('height').value);
    const heightM = heightCm / 100;
    const weight = parseFloat(document.getElementById('weight').value);

    if (!heightM || !weight) {
        alert('Please enter height and weight');
        return;
    }

    const bmi = (weight / (heightM * heightM)).toFixed(1);

    let category;
    let color;

    if (bmi < 18.5) {
        category = 'Underweight';
        color = '#00bfff';
    } else if (bmi < 25) {
        category = 'Normal';
        color = '#00cc66';
    } else if (bmi < 30) {
        category = 'Overweight';
        color = '#ffcc00';
    } else {
        category = 'Obese';
        color = '#ff3333';
    }

    document.getElementById('bmiValue').textContent = bmi;
    document.getElementById('bmiCategory').textContent = category;

    document.getElementById('bmiValue').style.color = color;
    document.getElementById('bmiCategory').style.color = color;

    document.getElementById('bmiResult').classList.remove('hidden');
}

/* Programs Tab Switching */
function switchTab(event, tabName) {
    const allTabs = document.querySelectorAll('.tab-btn');
    allTabs.forEach(tab => tab.classList.remove('active'));

    event.target.classList.add('active');

    document.getElementById('equipmentTab').classList.add('hidden');
    document.getElementById('bodyweightTab').classList.add('hidden');
    document.getElementById('bodypartsTab').classList.add('hidden');

    document.getElementById(tabName + 'Tab').classList.remove('hidden');
}

// Auto run on page load
document.addEventListener("DOMContentLoaded", loadUser);
