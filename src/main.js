import { LoginService } from "./api/LoginService.js";
import { renderLogin } from "./pages/login.js";

/* 🔹 BASE PATH (Vite dev/prod) */
let BASE_PATH = import.meta.env.BASE_URL || "/";

// Remove barra final se houver (evita //home.html)
if (!BASE_PATH.includes("localhost") && BASE_PATH.endsWith("/")) {
  BASE_PATH = BASE_PATH.slice(0, -1);
} else {
  // Se não termina com "/", adiciona
  if (!BASE_PATH.endsWith("/")) {
    BASE_PATH += "/";
  }
}

/* 🔹 APP CONTAINER */
const app = document.getElementById("app");
if (!app) throw new Error("App container (#app) not found");

/* 🔹 SERVICE */
const loginService = new LoginService();

/* 🔹 INIT */
function init() {
  const path = window.location.pathname.replace(/\/$/, "");

  if (loginService.isLogged()) {
    // já logado → vai para home.html
    if (!path.endsWith("home.html") && !path.endsWith("home")) {
      window.location.replace(`${BASE_PATH}/home`);
    }
    return;
  }

  // não logado → renderiza login
  renderLogin(app, () => {
    window.location.replace(`${BASE_PATH}/home`);
  });
}

init();
