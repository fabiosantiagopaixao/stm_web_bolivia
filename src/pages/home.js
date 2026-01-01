import { LoginService } from "../api/LoginService.js";
import { showLoading, hideLoading } from "../components/loading.js";
import { navigateTo, initRouteDefault } from "./route.js";

/* 🔹 BASE PATH (Vite) */
let BASE_PATH = import.meta.env.BASE_URL || "/";

// Remove barra final se houver (evita //home.html)
if (BASE_PATH.endsWith("/")) {
  BASE_PATH = BASE_PATH.slice(0, -1);
}

/* 🔹 USER IMAGE */
const userLogoMan = `${BASE_PATH}/img/profile_man.svg`;

/* 🔹 SERVICE */
const loginService = new LoginService();
const user = loginService.getLoggedUser();

/* 🔹 AUTH GUARD */
if (!user) {
  // não logado → redireciona para index
  window.location.replace(`${BASE_PATH}index`);
} else {
  // 🔹 USER DATA
  document.getElementById("userName").innerText = user.name;
  document.getElementById("nameCongregation").innerText =
    user.congregation_name;
  document.getElementById("userLogo").src = userLogoMan;

  /* 🔹 LOGOUT */
  document.getElementById("logoutLink").onclick = (e) => {
    e.preventDefault();
    showLoading(null, "Logout...");
    loginService.logout();
    document.getElementById("btnCloseModal")?.click();
    hideLoading();
    window.location.replace(`${BASE_PATH}`);
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
