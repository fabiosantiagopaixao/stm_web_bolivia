import { AddressService } from "../../api/services/AddressService.js";
import { LoginService } from "../../api/LoginService.js";
import { showLoading, hideLoading } from "../../components/loading.js";
import { renderTable } from "../../components/table.js";
import { renderAddressEdit } from "./address-edit.js";

export async function loadAddress() {
  const content = document.getElementById("card-data");
  document.getElementById("pageTitle").innerText = "Direcciones";

  showLoading(content, "Cargando Direcciones...");

  const service = new AddressService();
  const loginService = new LoginService();
  const addressLogged = loginService.getLoggedUser();
  const data = await service.getByCongregation(
    addressLogged.congregation_number
  );

  hideLoading(content);

  renderTable({
    container: content,
    columns: [
      { key: "gender", label: "Género", width: "100px" },
      { key: "name", label: "Nombre", width: "200px" },
      { key: "address", label: "Dirección" },
    ],
    data,
    rowsOptions: [15, 30, 60, 100, 150],
    tableHeight: null,
    onView: (address) => renderAddressEdit(content, address, true),
    onEdit: (address) => renderAddressEdit(content, address),
    onDelete: (id) => {
      if (confirm("Are you sure you want to delete address " + id + "?")) {
        alert("Deleted Address " + id);
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

    const newAddress = {
      id: null,
      number: "",
      name: "",
      password: "",
      type: "HOUSE_TO_HOUSE",
    };

    renderAddressEdit(content, newAddress);
  };
}
