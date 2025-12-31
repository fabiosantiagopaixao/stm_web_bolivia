import { LoginService } from "../api/LoginService.js";
import { showLoading, hideLoading } from "../components/loading.js";
import { navigateTo } from "./route.js";

/* 🔹 BASE PATH (Vite) */
const BASE_PATH = import.meta.env.BASE_URL;

/* 🔹 USER IMAGE */
const userLogoWomen = `${BASE_PATH}img/profile_woman.svg`;

/* 🔹 SERVICE */
const loginService = new LoginService();
const user = loginService.getLoggedUser();

/* 🔹 AUTH GUARD */
if (!user) {
  // não logado → redireciona para index
  window.location.replace(`${BASE_PATH}`);
} else {
  // 🔹 USER DATA
  document.getElementById("userName").innerText = user.name;
  document.getElementById("nameCongregation").innerText =
    user.congregation_name;
  document.getElementById("userLogo").src = userLogoWomen;

  /* 🔹 LOGOUT */
  document.getElementById("logoutLink").onclick = (e) => {
    e.preventDefault();
    showLoading(null, "Logout...");
    loginService.logout();
    document.getElementById("btnCloseModal")?.click();
    hideLoading();
    window.location.replace(`${BASE_PATH}index.html`);
  };

  /* 🔹 HOME CONTENT */
  loadHome();

  /* 🔹 CAPTURA CLIQUES NO MENU (SPA NAVIGATION) */
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-page]");
    if (!link) return;

    e.preventDefault();
    const page = link.dataset.page;
    navigateTo(page);
  });
}

/* 🔹 FUNÇÃO PARA CARREGAR O CONTEÚDO INICIAL */
export function loadHome() {
  document.getElementById("pageTitle").innerText = "Home";
  document.getElementById("card-data").innerHTML = `
    <div class="container mt-5 text-center">
      <h1 class="display-4 mb-3">Welcome to STM - Admin Panel</h1>
      <p class="lead">
        Select a menu option from the sidebar to start managing data.
      </p>
    </div>
  `;
}
