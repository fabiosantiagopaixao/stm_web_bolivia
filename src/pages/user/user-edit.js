import { UserService } from "../../api/services/UserService.js";
import { showLoading, hideLoading } from "../../components/loading.js";
import { loadUser } from "./index.js";
import { LoginService } from "../../api/LoginService.js";
import { renderAlertModal } from "../../components/renderAlertModal.js"; // ✅ novo modal
import { removeAddButton } from "../util/PagesUtil.js";

/* ================= Helpers ================= */
const USER_TYPES = [
  "PUBLISHER",
  "ADMINISTRATOR",
  "CIRCUIT_OVERSEER",
  "AUXILIARY",
];

function userTypeToLabel(type) {
  const map = {
    PUBLISHER: "Publicador",
    ADMINISTRATOR: "Administrador",
    CIRCUIT_OVERSEER: "Superintendente de circuito",
    AUXILIARY: "Auxiliar",
  };
  return map[type] || type;
}

function setInvalid(input) {
  input.classList.add("is-invalid");
}

function clearInvalid(input) {
  input.classList.remove("is-invalid");
}

/* ================= Component ================= */

export function renderUserEdit(container, userData, readonlyMode = false) {
  const newUser = userData.id === null;

  document.getElementById("pageTitle").innerText = newUser
    ? "Nuevo usuario"
    : readonlyMode
    ? `View User - ${userData.name}`
    : `Edit User - ${userData.name}`;

  container.innerHTML = `
   
      <div class="card-body">
        <form id="userForm" novalidate>

          <!-- Name / User -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Nombre</label>
              <input type="text" class="form-control" id="name" placeholder="Insira su nombre"
                     value="${userData.name}" ${readonlyMode ? "disabled" : ""}>
              <div class="invalid-feedback">El nombre es obligatorio</div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Usuario</label>
              <input type="text" class="form-control" id="user" placeholder="Insira su usuario"
                     value="${userData.user}" ${readonlyMode ? "disabled" : ""}>
              <div class="invalid-feedback">El usuario es obligatorio</div>
            </div>
          </div>

          <!-- Password -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Contraseña</label>
              <input type="password" class="form-control" id="password" placeholder="Insira su contraseña"
                     value="${userData.password}" ${
    readonlyMode ? "disabled" : ""
  }>
              <div class="invalid-feedback">La contraseña es obligatoria</div>
            </div>
          </div>

          <!-- Type / Active -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Type</label>
              <div class="mt-2" id="typeGroup">
                ${USER_TYPES.map(
                  (type) => `
                  <div class="form-check">
                    <input class="form-check-input"
                           type="radio"
                           name="type"
                           id="type_${type}"
                           value="${type}"
                           ${userData.type === type ? "checked" : ""}
                           ${readonlyMode ? "disabled" : ""}>
                    <label class="form-check-label" for="type_${type}">
                      ${userTypeToLabel(type)}
                    </label>
                  </div>
                `
                ).join("")}
                <div class="invalid-feedback" id="typeError">
                  El tipo de usuario es obligatorio
                </div>
              </div>
            </div>

            <div class="col-md-6 d-flex align-items-center">
              <div class="form-check mt-4">
                <input class="form-check-input" type="checkbox" id="active"
                       ${userData.active ? "checked" : ""}
                       ${readonlyMode ? "disabled" : ""}>
                <label class="form-check-label" for="active">
                  Activo
                </label>
                <div class="invalid-feedback">
                  Debe estar activo
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="row mt-4">
            <div class="col-md-12 d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" id="btnBack">
                <i class="fas fa-arrow-left"></i> Voltar
              </button>
              ${
                !readonlyMode
                  ? `
               <button type="submit" class="btn btn-primary" style="margin-right: 10px">
                  <i class="fas fa-save"></i> ${
                    newUser ? " Salvar" : " Actualizar"
                  }
                </button>
              `
                  : ""
              }
            </div>
          </div>

        </form>
      </div>
  `;

  /* ================= Validation & Submit ================= */
  removeAddButton();
  const form = container.querySelector("#userForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (readonlyMode) return;

    let hasError = false;

    const name = form.querySelector("#name");
    const user = form.querySelector("#user");
    const password = form.querySelector("#password");
    const active = form.querySelector("#active");
    const typeChecked = form.querySelector('input[name="type"]:checked');
    const typeError = form.querySelector("#typeError");

    [name, user, password, active].forEach(clearInvalid);
    typeError.style.display = "none";

    if (!name.value.trim()) {
      setInvalid(name);
      hasError = true;
    }

    if (!user.value.trim()) {
      setInvalid(user);
      hasError = true;
    }

    if (!password.value.trim()) {
      setInvalid(password);
      hasError = true;
    }

    if (!typeChecked) {
      typeError.style.display = "block";
      hasError = true;
    }

    if (hasError) return;

    const loginService = new LoginService();
    const updatedUser = {
      id: userData.id ?? null,
      name: name.value.trim(),
      user: user.value.trim(),
      password: password.value.trim(),
      type: typeChecked.value,
      active: active.checked,
      congregation_number: loginService.getLoggedUser().congregation_number,
    };

    showLoading(container, "Saving user...");

    try {
      const service = new UserService();
      await service.saveUpdate(updatedUser);

      // ✅ Modal de sucesso
      renderAlertModal(document.body, {
        type: "INFO",
        title: "Info",
        message: "Usuário salvo com sucesso!",
      }).modal("show");

      loadUser();
    } catch (error) {
      console.error("Error saving user:", error);

      renderAlertModal(document.body, {
        type: "ERROR",
        title: "Error",
        message: "Ocorreu um erro ao salvar usuário!",
      }).modal("show");
    } finally {
      hideLoading();
    }
  });

  container.querySelector("#btnBack").addEventListener("click", () => {
    loadUser();
  });
}
