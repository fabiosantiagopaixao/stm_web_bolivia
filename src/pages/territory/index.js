import { TerritoryService } from "../../api/services/TerritoryService.js";
import { LoginService } from "../../api/LoginService.js";
import { showLoading, hideLoading } from "../../components/loading.js";
import { renderTable } from "../../components/Table.js";

export async function loadTerritory() {
  const content = document.getElementById("card-data");
  document.getElementById("pageTitle").innerText = "Territories";

  // Mostra loading
  showLoading(content, "Loading Territories...");

  const service = new TerritoryService();
  const loginService = new LoginService();
  const userLogged = loginService.getLoggedUser();
  const data = await service.getByCongregation(userLogged.congregation_number);

  // Remove loading
  hideLoading(content);

  // Renderiza a tabela usando o componente genérico
  renderTable({
    container: content,
    columns: [
      { key: "id", label: "ID", width: "20px" },
      { key: "number", label: "Number", width: "20px" },
      { key: "name", label: "Name" } // largura automática
    ],
    data,
    rowsOptions: [15, 30, 60, 100, 150],
    tableHeight: null, // altura dinâmica baseada na tela
    onEdit: id => alert("Edit Territory " + id),
    onDelete: id => {
      if (confirm("Are you sure you want to delete territory " + id + "?")) {
        alert("Deleted Territory " + id);
      }
    }
  });
}
