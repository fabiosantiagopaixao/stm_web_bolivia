import { LoginService } from "../api/LoginService.js";
import { showLoading, hideLoading } from "../components/loading.js";
import { navigateTo, initRouteDefault } from "./route.js";
import { showConfirmModal } from "../components/modal.js";

/* 🔹 BASE PATH (Vite) */
let BASE_PATH = import.meta.env.BASE_URL || "/";
if (!BASE_PATH.includes("localhost") && BASE_PATH.endsWith("/")) {
  BASE_PATH = BASE_PATH.slice(0, -1);
} else {
  // Se não termina com "/", adiciona
  if (!BASE_PATH.endsWith("/")) {
    BASE_PATH += "/";
  }
}

/* 🔹 USER IMAGE */
const userLogoMan = `${BASE_PATH}/img/profile_man.svg`;

/* 🔹 SERVICE */
const loginService = new LoginService();
const user = loginService.getLoggedUser();

/* 🔹 AUTH GUARD */
if (!user) {
  // Usuário não logado → redireciona para login
  window.location.replace(`${BASE_PATH}/`);
} else {
  // 🔹 USER DATA
  document.getElementById("userName").innerText = user.name;
  document.getElementById("nameCongregation").innerText =
    user.congregation_name;
  document.getElementById("userLogo").src = userLogoMan;

  /* 🔹 LOGOUT MODAL DINÂMICO */
  const logoutModal = showConfirmModal({
    id: "logoutModal",
    title: "¿Listo para partir?",
    message:
      'Seleccione "Cerrar sesión" a continuación si está listo para finalizar su sesión actual.',
    primaryLabel: "Cerrar sesión",
    secondaryLabel: "Cancelar",
    onPrimary: () => {
      showLoading(null, "Logout...");
      loginService.logout();
      hideLoading();
      window.location.replace(`${BASE_PATH}`);
    },
  });

  /* 🔹 BOTÃO LOGOUT */
  const logoutBtn = document.getElementById("logoutTopbar");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      logoutModal.show();
    });
  }

  /* 🔹 INIT SPA */
  initRouteDefault(); // carrega home por padrão

  /* 🔹 SPA NAVIGATION - CLIQUES NO MENU */
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-page]");
    if (!link) return;
    e.preventDefault();
    const page = link.dataset.page;
    navigateTo(page);
  });
}
