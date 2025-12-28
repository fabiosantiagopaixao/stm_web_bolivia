import { CongregationService } from "../../api/services/CongregationService.js";
import { LoginService } from "../../api/LoginService.js";
import { showLoading, hideLoading } from "../../components/loading.js";
import { renderTable } from "../../components/Table.js";

export async function loadCongregation() {
  const content = document.getElementById("card-data");
  document.getElementById("pageTitle").innerText = "Congregations";

  // Mostra loading
  showLoading(content, "Loading Congregations...");

  const service = new CongregationService();
  const loginService = new LoginService();
  const userLogged = loginService.getLoggedUser();
  const data = await service.getByCongregation(userLogged.congregation_number);

  // Remove loading
  hideLoading(content);

  // Renderiza a tabela usando o componente genérico
  renderTable({
    container: content,
    columns: [
      { key: "id", label: "ID", width: "50px" },
      { key: "number", label: "Number", width: "80px" },
      { key: "name", label: "Name", width: "200px" },
      { key: "city", label: "City", width: "150px" },
      { key: "active", label: "Active", width: "80px" }
    ],
    data,
    rowsOptions: [15, 30, 60, 100, 150],
    tableHeight: null, // altura dinâmica baseada na tela
    onEdit: id => alert("Edit Congregation " + id),
    onDelete: id => {
      if (confirm("Are you sure you want to delete congregation " + id + "?")) {
        alert("Deleted Congregation " + id);
      }
    }
  });
}
