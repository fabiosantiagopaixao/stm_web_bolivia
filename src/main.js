import { CongregationService } from "./api/services/CongregationService.js";
import { LoginService } from "./api/LoginService.js";
import { showLoading, hideLoading } from "./components/loading.js";
import { showDialog } from "./components/dialog.js";
import { navigateTo } from "./route.js";

const container = document.getElementById("loginContainer");
const loginService = new LoginService(); // instância global

// Inicializa a página
async function init() {
  if (loginService.isLogged()) {
    window.location.href = "home.html";
    return;
  }
  await renderLoginForm(true);
}

// Renderiza o formulário de login
async function renderLoginForm(loading) {
  if (loading) {
    showLoading(container, "STM - Loading data...");
  }

  const congregationService = new CongregationService();
  const congregations = await congregationService.get();

  container.innerHTML = `
    <div class="card p-4 shadow" style="width: 360px;">
      <div class="text-center mb-3">
        <img src="img/logo.png" alt="Logo" style="max-width:120px;">
      </div>

      <h4 class="text-center text-primary mb-4">Login</h4>

      <div class="mb-3">
        <select id="congregation" class="form-select">
          <option value="">Select a congregation</option>
          ${congregations
            .map(
              (c) =>
                `<option value="${c.number}">${c.name} (${c.city})</option>`
            )
            .join("")}
        </select>
        <div class="invalid-feedback">Congregation is required</div>
      </div>

      <div class="mb-3">
        <input type="text" id="username" class="form-control" placeholder="Username">
        <div class="invalid-feedback">Username is required</div>
      </div>

      <div class="mb-3">
        <input type="password" id="password" class="form-control" placeholder="Password">
        <div class="invalid-feedback">Password is required</div>
      </div>

      <button id="loginBtn" class="btn btn-primary w-100">
        <i class="bi bi-box-arrow-in-right me-2"></i> Login
      </button>
    </div>
  `;

  hideLoading(); // remove overlay
  attachLoginEvent(congregations);
}

// Evento do botão login
function attachLoginEvent(congregations) {
  document.getElementById("loginBtn").addEventListener("click", async () => {
    const congregation = document.getElementById("congregation");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    const congregationId = congregation.value;
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    [congregation, usernameInput, passwordInput].forEach((el) =>
      el.classList.remove("is-invalid")
    );
    let valid = true;

    if (!congregationId) {
      congregation.classList.add("is-invalid");
      valid = false;
    }
    if (!username) {
      usernameInput.classList.add("is-invalid");
      valid = false;
    }
    if (!password) {
      passwordInput.classList.add("is-invalid");
      valid = false;
    }
    if (!valid) return;

    showLoading(null, "Login...");

    try {
      const user = await loginService.login(congregationId, username, password);
      hideLoading();

      if (user) {
        navigateTo("home"); // usa seu route.js
      } else {
        showDialog({
          type: "ERROR",
          message: "Login failed - Invalid credentials",
        });
      }
    } catch (err) {
      hideLoading();
      showDialog({
        type: "ERROR",
        message: "An error occurred while logging in.",
      });
    }
  });
}

// Listener global para navegação via menu
document.addEventListener("click", (event) => {
  const link = event.target.closest("[data-page]");
  if (!link) return;

  event.preventDefault();
  const page = link.getAttribute("data-page");
  navigateTo(page);

  document
    .querySelectorAll(".nav-item")
    .forEach((item) => item.classList.remove("active"));
  link.closest(".nav-item")?.classList.add("active");
});

init();
