let user = null;
let authMode = 'login';

/* Toggle Login / Signup */
function toggleAuthMode() {
    authMode = authMode === 'login' ? 'signup' : 'login';

    const nameField = document.getElementById('nameGroup');
    const title = document.getElementById('authTitle');
    const switchText = document.getElementById('authSwitchText');

    if (authMode === 'signup') {
        if (nameField) nameField.classList.remove('hidden');
        if (title) title.textContent = 'Create Account';
        if (switchText) switchText.textContent = 'Already have an account?';
    } else {
        if (nameField) nameField.classList.add('hidden');
        if (title) title.textContent = 'Login';
        if (switchText) switchText.textContent = 'Need an account?';
    }

    clearErrors();
}

/* Clear Form Errors */
function clearErrors() {
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    if (nameError) nameError.style.display = 'none';
    if (emailError) emailError.style.display = 'none';
    if (passwordError) passwordError.style.display = 'none';
}

/* Validate Email */
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

/* Validate Password */
function validatePassword(password) {
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    const isLongEnough = password.length >= 8;
    return hasSpecialChar && isLongEnough;
}

/* Login / Signup Handler */
function handleAuth() {
    clearErrors();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const name = nameInput ? nameInput.value : "";
    const email = emailInput ? emailInput.value : "";
    const password = passwordInput ? passwordInput.value : "";

    let isValid = true;

    // Signup name validation
    if (authMode === 'signup' && !name.trim()) {
        const nameError = document.getElementById('nameError');
        if (nameError) {
            nameError.textContent = 'Please enter your full name';
            nameError.style.display = 'block';
        }
        isValid = false;
    }

    // Email validation
    if (!email.trim()) {
        const emailError = document.getElementById('emailError');
        if (emailError) {
            emailError.textContent = 'Please enter your email';
            emailError.style.display = 'block';
        }
        isValid = false;
    } else if (!validateEmail(email)) {
        const emailError = document.getElementById('emailError');
        if (emailError) {
            emailError.textContent = 'Please enter a valid email address';
            emailError.style.display = 'block';
        }
        isValid = false;
    }

    // Password validation
    if (!password) {
        const passwordError = document.getElementById('passwordError');
        if (passwordError) {
            passwordError.textContent = 'Please enter your password';
            passwordError.style.display = 'block';
        }
        isValid = false;
    } else if (!validatePassword(password)) {
        const passwordError = document.getElementById('passwordError');
        if (passwordError) {
            passwordError.textContent =
                'Password must be at least 8 characters with one special character (!@#$%^&*)';
            passwordError.style.display = 'block';
        }
        isValid = false;
    }

    if (!isValid) return;

    // Create user object
    if (authMode === 'signup') {
        user = { name: name, email: email };
    } else {
        user = { name: email.split('@')[0], email: email };
    }

    // Save user in localStorage
    localStorage.setItem("healthfitUser", JSON.stringify(user));

    // Redirect to home
    window.location.href = "index.html";
}

/* Logout */
function logout() {
    user = null;
    localStorage.removeItem("healthfitUser");
    window.location.href = "index.html";
}

/* Load user on every page */
function loadUser() {
    const saved = localStorage.getItem("healthfitUser");

    if (saved) {
        user = JSON.parse(saved);

        const userSection = document.getElementById('userSection');
        if (userSection) {
            userSection.innerHTML =
                `<span style="color: #ff6600; font-weight:bold;">Hi, ${user.name}</span>
                 <button class="btn-primary" style="margin-left:10px;" onclick="logout()">Logout</button>`;
        }

        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome back, ${user.name}!`;
            welcomeMessage.style.display = 'block';
        }
    }
}

/* BMI COLOR BASED RESULTS */
function calculateBMI() {
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');

    if (!heightInput || !weightInput) return;

    const heightCm = parseFloat(heightInput.value);
    const heightM = heightCm / 100;
    const weight = parseFloat(weightInput.value);

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

    const bmiValue = document.getElementById('bmiValue');
    const bmiCategory = document.getElementById('bmiCategory');
    const bmiResult = document.getElementById('bmiResult');

    if (bmiValue) {
        bmiValue.textContent = bmi;
        bmiValue.style.color = color;
    }

    if (bmiCategory) {
        bmiCategory.textContent = category;
        bmiCategory.style.color = color;
    }

    if (bmiResult) bmiResult.classList.remove('hidden');
}

/* Programs Tab Switching */
function switchTab(event, tabName) {
    const allTabs = document.querySelectorAll('.tab-btn');
    allTabs.forEach(tab => tab.classList.remove('active'));

    if (event && event.target) event.target.classList.add('active');

    const equipmentTab = document.getElementById('equipmentTab');
    const bodyweightTab = document.getElementById('bodyweightTab');
    const bodypartsTab = document.getElementById('bodypartsTab');

    if (equipmentTab) equipmentTab.classList.add('hidden');
    if (bodyweightTab) bodyweightTab.classList.add('hidden');
    if (bodypartsTab) bodypartsTab.classList.add('hidden');

    const activeTab = document.getElementById(tabName + 'Tab');
    if (activeTab) activeTab.classList.remove('hidden');
}

/* Auto run on page load */
document.addEventListener("DOMContentLoaded", loadUser);
