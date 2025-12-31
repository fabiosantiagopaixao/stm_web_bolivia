import { LoginService } from "../api/LoginService.js";
import { showLoading, hideLoading } from "../components/loading.js";
import { navigateTo, initRouteDefault } from "./route.js";

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
  window.location.replace(`${BASE_PATH}index.html`);
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

  /* 🔹 INIT SPA */
  initRouteDefault(); // carrega home por padrão

  /* 🔹 CAPTURA CLIQUES NO MENU (SPA NAVIGATION) */
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-page]");
    if (!link) return;
    e.preventDefault();
    const page = link.dataset.page;
    navigateTo(page);
  });
}
