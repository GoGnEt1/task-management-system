const showLoginBtn = document.querySelector(".login-btn");
const hideLoginBtn = document.querySelector(".login-form .close-btn");
const openButton = document.querySelector(".login-form .close-btn");
const formLogin = document.querySelector(".login-form");
const loginSignupLink = document.querySelectorAll(".form-box .end-form a");

const containerMenu = document.querySelector(".container .nav-links")
// const openButton = document.querySelector(".menu-open-btn");
const closeButton = document.querySelector(".menu-close-button");

if (showLoginBtn) {
  showLoginBtn.addEventListener("click", () => {
    document.body.classList.toggle("show-login");
  });
}

// les deux blocs suivantes sont équivalentes et permettent de fermer le formulaire de login
// la première fonctionne bien même si on utilise la méthode 'add' au lieu de 'toggle' 
// mais la deuxième est plus simple et plus rapide

// if (hideLoginBtn) {
//   hideLoginBtn.addEventListener("click", () => {
//     document.body.classList.remove("show-login");
//   });
// }

if (hideLoginBtn) {
  hideLoginBtn.addEventListener("click", () => showLoginBtn.click());
}

loginSignupLink.forEach((link) => { 
  link.addEventListener("click", (e) => {
    e.preventDefault();
    formLogin.classList[link.id === "signup-link" ? "add" : "remove"]("show-signup");
  });
});

if (openButton) {
  openButton.addEventListener("click", () => {
    containerMenu.classList.toggle("show-menu");
  });
}

if (closeButton) {
  closeButton.addEventListener('click', () => openButton.click());
}