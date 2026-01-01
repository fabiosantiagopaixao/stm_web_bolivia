import { CongregationService } from "../api/services/CongregationService.js";
import { LoginService } from "../api/LoginService.js";
import { showLoading, hideLoading } from "../components/loading.js";
import { showDialog } from "../components/dialog.js";

/* 🔹 BASE PATH (Vite dev/prod) */
let BASE_PATH = import.meta.env.BASE_URL || "/";

if (!BASE_PATH.includes("localhost") && BASE_PATH.endsWith("/")) {
  BASE_PATH = BASE_PATH.slice(0, -1);
}

/* 🔹 UTIL: delay async */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* 🔹 RENDER LOGIN */
export async function renderLogin() {
  const startTime = Date.now();

  showLoading(null, "STM Login");

  const app = document.getElementById("app");
  const pageTop = document.getElementById("page-top");

  const loginService = new LoginService();
  const congregationService = new CongregationService();

  let congregations = [];

  try {
    congregations = await congregationService.get();
  } catch (err) {
    hideLoading();
    showDialog({ type: "ERROR", message: "Failed to load congregations" });
    return;
  }

  /* ⏱️ garante loading mínimo de 2 segundos */
  const elapsed = Date.now() - startTime;
  if (elapsed < 2000) {
    await wait(2000 - elapsed);
  }

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
          <input
            id="password"
            type="password"
            class="form-control"
            placeholder="Password"
          >
          <div class="invalid-feedback">Password is required</div>
        </div>

        <button id="loginBtn" class="btn btn-primary w-100">
          Login
        </button>
      </div>
    </div>
  `;

  hideLoading();

  attachInputListeners();

  document.getElementById("loginBtn").onclick = async () => {
    if (!validateInputs()) return;
    await handleLogin(loginService);
  };
}

/* 🔹 VALIDA INPUTS */
function validateInputs() {
  let valid = true;

  const congregation = document.getElementById("congregation");
  const username = document.getElementById("username");
  const password = document.getElementById("password");

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

/* 🔹 REMOVE ERRO AO DIGITAR */
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

/* 🔹 LOGIN */
async function handleLogin(loginService) {
  const start = Date.now();

  showLoading(null, "Login...");

  try {
    const congregationId = document.getElementById("congregation").value;
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const user = await loginService.login(congregationId, username, password);

    /* ⏱️ loading mínimo 1.5s */
    const elapsed = Date.now() - start;
    if (elapsed < 1500) {
      await wait(1500 - elapsed);
    }

    hideLoading();

    if (user) {
      window.location.replace(`${BASE_PATH}home`);
    } else {
      showDialog({
        type: "ERROR",
        message: "Invalid credentials",
      });
    }
  } catch (err) {
    hideLoading();
    showDialog({
      type: "ERROR",
      message: "Login error",
    });
  }
}
