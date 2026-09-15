// Вікна
const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");


// Відкрити Login
function openLogin() {
    loginModal.style.display = "flex";
    registerModal.style.display = "none";
}


// Відкрити Sign up
function openRegister() {
    registerModal.style.display = "flex";
    loginModal.style.display = "none";
}


// Закрити Login
function closeLogin() {
    loginModal.style.display = "none";
}


// Закрити Sign up
function closeRegister() {
    registerModal.style.display = "none";
}
