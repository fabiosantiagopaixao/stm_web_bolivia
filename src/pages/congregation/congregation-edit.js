import { UserService } from "../../api/services/UserService.js";
import { showLoading, hideLoading } from "../../components/loading.js";
import { removeAddButton } from "../util/PagesUtil.js";

/**
 * Renderiza a página de edição ou visualização de usuário
 * @param {HTMLElement} container
 * @param {Object} userData - dados do usuário
 * @param {boolean} readonlyMode - se true, todos inputs ficam desabilitados
 */
export function renderCongregationsEdit(
  container,
  userData,
  readonlyMode = false
) {
  removeAddButton();
  let title = readonlyMode ? "View User" : "Edit User";
  title = title + " - " + userData.name;
  const titleElement = document.getElementById("pageTitle");
  if (titleElement) {
    document.getElementById("pageTitle").innerText = title;
  }

  container.innerHTML = `
    <div class="card shadow mb-4">
     
      <div class="card-body">
        <form id="userForm">
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="congregation_name" class="form-label">Congregation Name</label>
              <input type="text" class="form-control" id="congregation_name" value="${
                userData.congregation_name
              }" ${readonlyMode ? "disabled" : ""}>
            </div>
            <div class="col-md-6">
              <label for="name" class="form-label">Name</label>
              <input type="text" class="form-control" id="name" value="${
                userData.name
              }" ${readonlyMode ? "disabled" : ""}>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label for="user" class="form-label">Usuario</label>
              <input type="text" class="form-control" id="user" value="${
                userData.user
              }" ${readonlyMode ? "disabled" : ""}>
            </div>
            <div class="col-md-6">
              <label for="password" class="form-label">Contraseña</label>
              <input type="password" class="form-control" id="password" value="${
                userData.password
              }" ${readonlyMode ? "disabled" : ""}>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <label for="type" class="form-label">Type</label>
              <input type="text" class="form-control" id="type" value="${
                userData.type
              }" ${readonlyMode ? "disabled" : ""}>
            </div>
            <div class="col-md-6 d-flex align-items-center">
              <div class="form-check mt-4">
                <input class="form-check-input" type="checkbox" id="active" ${
                  userData.active ? "checked" : ""
                } ${readonlyMode ? "disabled" : ""}>
                <label class="form-check-label" for="active">
                  Activo
                </label>
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
                <i class="fas fa-save"></i> Salvar
              </button>`
                  : ""
              }
            </div>
          </div>
        </form>
      </div>
    </div>
  `;

  // Eventos
  const form = container.querySelector("#userForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (readonlyMode) return;

    const updatedUser = {
      id: userData.id,
      congregation_name: form.querySelector("#congregation_name").value,
      name: form.querySelector("#name").value,
      user: form.querySelector("#user").value,
      password: form.querySelector("#password").value,
      type: form.querySelector("#type").value,
      active: form.querySelector("#active").checked,
    };

    showLoading(container, "Saving user...");
    const service = new UserService();
    await service.update(updatedUser); // supondo que exista o método update
    hideLoading(container);
    alert("User saved successfully!");
  });

  container.querySelector("#btnBack").addEventListener("click", () => {
    window.history.back(); // ou redireciona para a lista de usuários
  });
}
