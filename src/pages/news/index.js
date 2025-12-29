import { UserService } from "../../api/services/UserService.js";
import { LoginService } from "../../api/LoginService.js";
import { showLoading, hideLoading } from "../../components/loading.js";
import { renderTable } from "../../components/table.js";
import { renderNewsEdit } from "./news-edit.js";

export async function loadNews() {
  const content = document.getElementById("card-data");
  document.getElementById("pageTitle").innerText = "News";

  // Mostra loading
  showLoading(content, "Loading News...");

  const service = new UserService();
  const loginService = new LoginService();
  const userLogged = loginService.getLoggedUser();
  const data = await service.getByCongregation(userLogged.congregation_number);

  // Remove loading
  hideLoading(content);

  // Renderiza a tabela usando o componente genérico
  renderTable({
    container: content,
    columns: [
      { key: "congregation_name", label: "Congregation Name", width: "200px" },
      { key: "name", label: "Name", width: "150px" },
      { key: "user", label: "Usuario", width: "100px" },
      { key: "password", label: "Contraseña", width: "100px" },
      { key: "active", label: "Activo", width: "80px" },
    ],
    data,
    rowsOptions: [15, 30, 60, 100, 150],
    tableHeight: null, // altura dinâmica baseada na tela
    disableDelete: true,
    onView: (user) => renderNewsEdit(content, user, true),
    onEdit: (id) => alert("Edit User " + id),
    onDelete: (id) => {
      if (confirm("Are you sure you want to delete user " + id + "?")) {
        alert("Deleted User " + id);
      }
    },
  });
}
