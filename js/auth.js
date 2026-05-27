// circlan_v2/js/auth.js

document.addEventListener('DOMContentLoaded', () => {
    // Password Toggle Login
    const loginToggle = document.getElementById('toggle-login-pass');
    const loginInput = document.getElementById('login-password');
    
    if (loginToggle && loginInput) {
        loginToggle.addEventListener('click', () => {
            const type = loginInput.getAttribute('type') === 'password' ? 'text' : 'password';
            loginInput.setAttribute('type', type);
            loginToggle.innerHTML = type === 'password' ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
        });
    }

    // Password Toggle Register
    const regToggle = document.getElementById('toggle-reg-pass');
    const regInput = document.getElementById('reg-password');
    
    if (regToggle && regInput) {
        regToggle.addEventListener('click', () => {
            const type = regInput.getAttribute('type') === 'password' ? 'text' : 'password';
            regInput.setAttribute('type', type);
            regToggle.innerHTML = type === 'password' ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
        });
    }
});
