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
              <label class="form-label">Numero</label>
              <input type="text" class="form-control" id="number" placeholder="Insira el número T-0001"
                     value="${territoryData.number}" ${
    readonlyMode || newTerritory ? "disabled" : ""
  }>
              <div class="invalid-feedback">El nombre es obligatorio</div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Nombre</label>
              <input type="text" class="form-control" id="name" placeholder="Insira el nombre"
                     value="${territoryData.name}" ${
    readonlyMode ? "disabled" : ""
  }>
              <div class="invalid-feedback">El usuario es obligatorio</div>
            </div>
          </div>

          <!-- Type / Active -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Tipo</label>
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

    const number = form.querySelector("#number");
    const name = form.querySelector("#name");
    const typeChecked = form.querySelector('input[name="type"]:checked');
    const typeError = form.querySelector("#typeError");

    [name, territory, password, active].forEach(clearInvalid);
    typeError.style.display = "none";

    if (!name.value.trim()) {
      setInvalid(name);
      hasError = true;
    }

    if (!typeChecked) {
      typeError.style.display = "block";
      hasError = true;
    }

    if (hasError) return;
    try {
      const service = new TerritoryService();
      const loginService = new LoginService();
      const updatedTerritory = {
        id: territoryData.id ?? null,
        number: generateNumber(),
        name: name.value.trim(),
        type: typeChecked.value,
        congregation_number:
          loginService.getLoggedTerritory().congregation_number,
      };

      showLoading(container, "Saving territory...");

      await service.saveUpdate(updatedTerritory);

      // ✅ Modal de sucesso
      renderAlertModal(document.body, {
        type: "INFO",
        title: "Info",
        message: "Territorio salvo com sucesso!",
      }).modal("show");

      loadTerritory();
    } catch (error) {
      console.error("Error saving territory:", error);

      renderAlertModal(document.body, {
        type: "ERROR",
        title: "Error",
        message: "Ocorreu um erro ao salvar teritorio!",
      }).modal("show");
    } finally {
      hideLoading();
    }
  });

  container.querySelector("#btnBack").addEventListener("click", () => {
    loadTerritory();
  });

  function generateNumber() {}
}
