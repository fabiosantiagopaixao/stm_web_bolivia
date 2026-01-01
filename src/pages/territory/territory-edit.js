import { TerritoryService } from "../../api/services/TerritoryService.js";
import { showLoading, hideLoading } from "../../components/loading.js";
import { loadTerritory } from "./index.js";
import { LoginService } from "../../api/LoginService.js";
import { renderAlertModal } from "../../components/renderAlertModal.js"; // ✅ novo modal
import { territoryTypeToLabel } from "./shared-territory.js";

/* ================= Helpers ================= */

const TERRITORY_TYPES = ["HOUSE_TO_HOUSE", "PHONE"];

function setInvalid(input) {
  input.classList.add("is-invalid");
}

function clearInvalid(input) {
  input.classList.remove("is-invalid");
}

/* ================= Component ================= */

export function renderTerritoryEdit(
  container,
  territoryData,
  readonlyMode = false
) {
  const newTerritory = territoryData.id === null;

  document.getElementById("pageTitle").innerText = newTerritory
    ? "Nuevo territorio"
    : readonlyMode
    ? `View Territory - ${territoryData.name}`
    : `Edit Territory - ${territoryData.name}`;

  container.innerHTML = `
   
      <div class="card-body">
        <form id="territoryForm" novalidate>

          <!-- Name / Territory -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Nombre</label>
              <input type="text" class="form-control" id="name" placeholder="Insira el número T-0001"
                     value="${territoryData.number}" ${
    readonlyMode ? "disabled" : ""
  }>
              <div class="invalid-feedback">El nombre es obligatorio</div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Usuario</label>
              <input type="text" class="form-control" id="territory" placeholder="Insira el nombre"
                     value="${territoryData.name}" ${
    readonlyMode ? "disabled" : ""
  }>
              <div class="invalid-feedback">El usuario es obligatorio</div>
            </div>
          </div>

          <!-- Type / Active -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Type</label>
              <div class="mt-2" id="typeGroup">
                ${TERRITORY_TYPES.map(
                  (type) => `
                  <div class="form-check">
                    <input class="form-check-input"
                           type="radio"
                           name="type"
                           id="type_${type}"
                           value="${type}"
                           ${territoryData.type === type ? "checked" : ""}
                           ${readonlyMode ? "disabled" : ""}>
                    <label class="form-check-label" for="type_${type}">
                      ${territoryTypeToLabel(type)}
                    </label>
                  </div>
                `
                ).join("")}
                <div class="invalid-feedback" id="typeError">
                  El tipo de usuario es obligatorio
                </div>
              </div>
            </div>
              
          </div>

          <!-- Actions -->
          <div class="row mt-4">
            <div class="col-md-12 d-flex justify-content-end gap-2">
              ${
                !readonlyMode
                  ? `
               <button type="submit" class="btn btn-primary" style="margin-right: 10px">
                  <i class="fas fa-save"></i> ${
                    newTerritory ? " Salvar" : " Actualizar"
                  }
                </button>
              `
                  : ""
              }
              <button type="button" class="btn btn-success" id="btnBack">
                <i class="fas fa-arrow-left"></i> Voltar
              </button>
            </div>
          </div>

        </form>
      </div>
  `;

  /* ================= Validation & Submit ================= */

  const form = container.querySelector("#territoryForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (readonlyMode) return;

    let hasError = false;

    const name = form.querySelector("#name");
    const territory = form.querySelector("#territory");
    const password = form.querySelector("#password");
    const active = form.querySelector("#active");
    const typeChecked = form.querySelector('input[name="type"]:checked');
    const typeError = form.querySelector("#typeError");

    [name, territory, password, active].forEach(clearInvalid);
    typeError.style.display = "none";

    if (!name.value.trim()) {
      setInvalid(name);
      hasError = true;
    }

    if (!territory.value.trim()) {
      setInvalid(territory);
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

    if (!active.checked) {
      setInvalid(active);
      hasError = true;
    }

    if (hasError) return;

    const loginService = new LoginService();
    const updatedTerritory = {
      id: territoryData.id ?? null,
      name: name.value.trim(),
      territory: territory.value.trim(),
      password: password.value.trim(),
      type: typeChecked.value,
      active: active.checked,
      congregation_number:
        loginService.getLoggedTerritory().congregation_number,
    };

    showLoading(null, "Saving territory...");

    try {
      const service = new TerritoryService();
      await service.saveUpdate(updatedTerritory);

      // ✅ Modal de sucesso
      renderAlertModal(document.body, {
        type: "INFO",
        title: "Info",
        message: "Usuário salvo com sucesso!",
      }).modal("show");

      loadTerritory();
    } catch (error) {
      console.error("Error saving territory:", error);

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
    loadTerritory();
  });
}
