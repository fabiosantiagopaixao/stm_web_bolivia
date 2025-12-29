import { CongregationService } from "./api/services/CongregationService.js";
import { LoginService } from "./api/LoginService.js";
import { showLoading, hideLoading } from "./components/loading.js";
import { showDialog } from "./components/dialog.js";

const app = document.getElementById("app");
const loginService = new LoginService();

if (!app) {
  throw new Error("App container (#app) not found");
}

// ---------- LOGIN ----------
async function renderLogin() {
  showLoading(app, "STM - Loading data...");

  const congregationService = new CongregationService();
  const congregations = await congregationService.get();

  app.innerHTML = `
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card p-4 shadow" style="width: 360px;">
        <div class="text-center mb-3">
          <img src="img/logo.png" style="max-width:120px;">
        </div>

        <h4 class="text-center text-primary mb-4">Login</h4>

        <div class="mb-3">
          <select id="congregation" class="form-select">
            <option value="">Select a congregation</option>
            ${congregations
              .map((c) => `<option value="${c.number}">${c.name}</option>`)
              .join("")}
          </select>
        </div>

        <div class="mb-3">
          <input id="username" class="form-control" placeholder="Username">
        </div>

        <div class="mb-3">
          <input id="password" type="password" class="form-control" placeholder="Password">
        </div>

        <button id="loginBtn" class="btn btn-primary w-100">Login</button>
      </div>
    </div>
  `;

  hideLoading();

  document.getElementById("loginBtn").onclick = handleLogin;
}

async function handleLogin() {
  showLoading(app, "Login...");

  try {
    const congregationId = document.getElementById("congregation").value;
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const user = await loginService.login(congregationId, username, password);

    hideLoading();

    if (user) {
      renderHome();
    } else {
      showDialog({ type: "ERROR", message: "Invalid credentials" });
    }
  } catch {
    hideLoading();
    showDialog({ type: "ERROR", message: "Login error" });
  }
}

// ---------- HOME ----------
function renderHome() {
  app.innerHTML = `
    <div class="container p-4">
      <h2>Welcome 👋</h2>
      <button id="logoutBtn" class="btn btn-danger mt-3">Logout</button>
    </div>
  `;

  document.getElementById("logoutBtn").onclick = () => {
    loginService.logout();
    renderLogin();
  };
}

// ---------- BOOTSTRAP ----------
function init() {
  if (loginService.isLogged()) {
    renderHome();
  } else {
    renderLogin();
  }
}

init();
