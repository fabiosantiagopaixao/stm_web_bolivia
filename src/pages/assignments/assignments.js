import { AddressService } from "../../api/services/AddressService.js";
import { LoginService } from "../../api/LoginService.js";
import { showLoading, hideLoading } from "../../components/loading.js";
import { renderTable } from "../../components/Table.js";

export async function loadAssignments() {
  const content = document.getElementById("card-data");
  document.getElementById("pageTitle").innerText = "Addresses";

  // Mostra loading
  showLoading(content, "Loading Addresses...");

  const service = new AddressService();
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
      { key: "congregation_number", label: "Congregation", width: "80px" },
      { key: "name", label: "Name", width: "200px" },
      { key: "address", label: "Address", width: "300px" },
      { key: "gender", label: "Gender", width: "80px" },
      { key: "age_type", label: "Age Type", width: "100px" },
      { key: "deaf", label: "Deaf", width: "60px" },
      { key: "mute", label: "Mute", width: "60px" },
      { key: "blind", label: "Blind", width: "60px" },
      { key: "sign", label: "Sign", width: "60px" },
      { key: "phone", label: "Phone", width: "150px" }
    ],
    data,
    rowsOptions: [15, 30, 60, 100, 150],
    tableHeight: null, // altura dinâmica baseada na tela
    onEdit: id => alert("Edit Address " + id),
    onDelete: id => {
      if (confirm("Are you sure you want to delete address " + id + "?")) {
        alert("Deleted Address " + id);
      }
    }
  });
}
