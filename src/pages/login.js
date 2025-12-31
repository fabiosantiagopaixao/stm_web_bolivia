import { CongregationService } from "../api/services/CongregationService.js";
import { LoginService } from "../api/LoginService.js";
import { showLoading, hideLoading } from "../components/loading.js";
import { showDialog } from "../components/dialog.js";

/* 🔹 BASE PATH (Vite dev/prod) */
let BASE_PATH = "/";

if (BASE_PATH.endsWith("/")) {
  BASE_PATH = BASE_PATH.slice(0, -1);
}

export async function renderLogin() {
  const app = document.getElementById("app");
  const pageTop = document.getElementById("page-top");
  const loginService = new LoginService();

  const congregationService = new CongregationService();
  const congregations = await congregationService.get();

  if (pageTop) pageTop.innerHTML = "";

  app.innerHTML = `
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card p-4 shadow" style="width: 360px;">
        <div class="text-center mb-3">
          <img src="${BASE_PATH}/img/logo.png" style="max-width:120px;">
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
          <div class="invalid-feedback">Please select a congregation</div>
        </div>

        <div class="mb-3">
          <input id="username" class="form-control" placeholder="Username">
          <div class="invalid-feedback">Username is required</div>
        </div>

        <div class="mb-3">
          <input id="password" type="password" class="form-control" placeholder="Password">
          <div class="invalid-feedback">Password is required</div>
        </div>

        <button id="loginBtn" class="btn btn-primary w-100">Login</button>
      </div>
    </div>
  `;

  hideLoading();

  attachInputListeners(); // adiciona listeners para remover erro ao digitar/selecionar

  document.getElementById("loginBtn").onclick = async () => {
    if (!validateInputs()) return; // ✅ só segue se os campos estiverem preenchidos
    await handleLogin(loginService);
  };
}

/* 🔹 VALIDA INPUTS */
function validateInputs() {
  let valid = true;

  const congregation = document.getElementById("congregation");
  const username = document.getElementById("username");
  const password = document.getElementById("password");

  // remove classe de erro anterior
  [congregation, username, password].forEach((el) =>
    el.classList.remove("is-invalid")
  );

  if (!congregation.value) {
    congregation.classList.add("is-invalid");
    valid = false;
  }
  if (!username.value.trim()) {
    username.classList.add("is-invalid");
    valid = false;
  }
  if (!password.value.trim()) {
    password.classList.add("is-invalid");
    valid = false;
  }

  return valid;
}

/* 🔹 REMOVE ERRO QUANDO USUÁRIO COMEÇA A DIGITAR/SELECIONAR */
function attachInputListeners() {
  const fields = [
    document.getElementById("congregation"),
    document.getElementById("username"),
    document.getElementById("password"),
  ];

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      if (field.value.trim() || (field.tagName === "SELECT" && field.value)) {
        field.classList.remove("is-invalid");
      }
    });
  });
}

async function handleLogin(loginService) {
  showLoading(null, "Login...");

  try {
    const congregationId = document.getElementById("congregation").value;
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const user = await loginService.login(congregationId, username, password);

    hideLoading();

    if (user) {
      /* 🔹 Redireciona para home.html */
      window.location.replace(`${BASE_PATH}/home.html`);
    } else {
      showDialog({ type: "ERROR", message: "Invalid credentials" });
    }
  } catch {
    hideLoading();
    showDialog({ type: "ERROR", message: "Login error" });
  }
}
