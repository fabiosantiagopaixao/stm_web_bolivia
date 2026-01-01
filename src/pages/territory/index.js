import { TerritoryService } from "../../api/services/TerritoryService.js";
import { LoginService } from "../../api/LoginService.js";
import { showLoading, hideLoading } from "../../components/loading.js";
import { renderTable } from "../../components/table.js";
import { renderTerritoryEdit } from "./territory-edit.js";

export async function loadTerritory() {
  const content = document.getElementById("card-data");
  document.getElementById("pageTitle").innerText = "Territorios";

  showLoading(content, "Cargando Territorios...");

  const service = new TerritoryService();
  const loginService = new LoginService();
  const territoryLogged = loginService.getLoggedUser();
  const data = await service.getByCongregation(
    territoryLogged.congregation_number
  );

  hideLoading(content);

  renderTable({
    container: content,
    columns: [
      { key: "number", label: "Número", width: "150px" },
      { key: "name", label: "Nombre", width: "100px" },
      { key: "type", label: "Tipo", width: "100px" },
    ],
    data,
    rowsOptions: [15, 30, 60, 100, 150],
    tableHeight: null,
    onView: (territory) => renderTerritoryEdit(content, territory, true),
    onEdit: (territory) => renderTerritoryEdit(content, territory),
    onDelete: (id) => {
      if (confirm("Are you sure you want to delete territory " + id + "?")) {
        alert("Deleted Territory " + id);
      }
    },
  });

  setupAddButton(content);
}

/* 🔹 FUNÇÃO PARA CONFIGURAR O BOTÃO "ADICIONAR" */
function setupAddButton(content) {
  const btnAdd = document.getElementById("btnAdd");
  if (!btnAdd) return;

  btnAdd.classList.remove("noneButton");

  btnAdd.onclick = (e) => {
    e.preventDefault();

    const newTerritory = {
      id: null,
      number: "",
      name: "",
      password: "",
      type: "HOUSE_TO_HOUSE",
    };

    renderTerritoryEdit(content, newTerritory);
  };
}
