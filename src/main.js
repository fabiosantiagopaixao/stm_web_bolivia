import { LoginService } from "./api/LoginService.js";
import { renderLogin } from "./pages/login.js";

/* 🔹 BASE PATH (Vite dev/prod) */
const BASE_PATH = import.meta.env.BASE_URL; // "/stm_web_bolivia/" ou "/" em dev

/* 🔹 REDIRECIONA URL INVÁLIDA PARA INDEX */
const path = window.location.pathname.replace(/\/$/, ""); // remove "/" final

// ✅ considera válido se terminar com "/" ou "index.html"
console.log(path);
if (!window.location.pathname.endsWith("/") && !path.endsWith("index.html")) {
  window.location.replace(`${BASE_PATH}index.html`);
}

/* 🔹 APP CONTAINER */
const app = document.getElementById("app");
if (!app) {
  throw new Error("App container (#app) not found");
}

/* 🔹 SERVICE */
const loginService = new LoginService();

/* 🔹 INIT */
function init() {
  if (loginService.isLogged()) {
    // ✅ já logado → vai para home.html
    if (!window.location.pathname.endsWith("home.html")) {
      window.location.replace(`${BASE_PATH}/home.html`);
    }
    return;
  }

  // ❌ não logado → renderiza login
  renderLogin(app, () => {
    // callback de sucesso do login
    window.location.replace(`${BASE_PATH}/home.html`);
  });
}

init();
