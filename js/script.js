let user = null;
let authMode = 'login';

function toggleAuthMode() {
    authMode = authMode === 'login' ? 'signup' : 'login';

    const nameField = document.getElementById('nameGroup');
    const title = document.getElementById('authTitle');
    const switchText = document.getElementById('authSwitchText');

    // ✅ SAFETY CHECK (so it doesn't break if login elements not present)
    if (!nameField || !title || !switchText) return;

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
    const emailEl = document.getElementById('email');
    const passwordEl = document.getElementById('password');

    // ✅ SAFETY CHECK
    if (!emailEl || !passwordEl) return;

    const email = emailEl.value;
    const password = passwordEl.value;

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
                '<button class="btn-primary" style="margin-left:10px;" onclick="logout()">Logout</button>';
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
    const heightEl = document.getElementById('height');
    const weightEl = document.getElementById('weight');

    // ✅ SAFETY CHECK (so it doesn't break on other pages)
    if (!heightEl || !weightEl) return;

    const heightCm = parseFloat(heightEl.value);
    const heightM = heightCm / 100;
    const weight = parseFloat(weightEl.value);

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

    const bmiValueEl = document.getElementById('bmiValue');
    const bmiCategoryEl = document.getElementById('bmiCategory');
    const bmiResultEl = document.getElementById('bmiResult');

    // ✅ SAFETY CHECK
    if (!bmiValueEl || !bmiCategoryEl || !bmiResultEl) return;

    bmiValueEl.textContent = bmi;
    bmiCategoryEl.textContent = category;

    bmiValueEl.style.color = color;
    bmiCategoryEl.style.color = color;

    bmiResultEl.classList.remove('hidden');
}

/* Programs Tab Switching */
function switchTab(event, tabName) {
    // ✅ SAFETY CHECK (if programs elements are not present, just return)
    const equipmentTab = document.getElementById('equipmentTab');
    const bodyweightTab = document.getElementById('bodyweightTab');
    const bodypartsTab = document.getElementById('bodypartsTab');

    if (!equipmentTab || !bodyweightTab || !bodypartsTab) return;

    const allTabs = document.querySelectorAll('.tab-btn');
    allTabs.forEach(tab => tab.classList.remove('active'));

    if (event && event.target) {
        event.target.classList.add('active');
    }

    equipmentTab.classList.add('hidden');
    bodyweightTab.classList.add('hidden');
    bodypartsTab.classList.add('hidden');

    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) selectedTab.classList.remove('hidden');
}

// Auto run on page load
document.addEventListener("DOMContentLoaded", () => {
    loadUser();

    // ✅ AUTO DEFAULT TAB ONLY IF PROGRAMS PAGE HAS TABS
    const equipmentTab = document.getElementById('equipmentTab');
    const firstTabBtn = document.querySelector('.tab-btn');

    if (equipmentTab && firstTabBtn) {
        // Ensure Equipment tab is shown by default
        equipmentTab.classList.remove('hidden');
        firstTabBtn.classList.add('active');
    }
});
