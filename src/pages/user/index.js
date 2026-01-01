import { UserService } from "../../api/services/UserService.js";
import { LoginService } from "../../api/LoginService.js";
import { showLoading, hideLoading } from "../../components/loading.js";
import { renderTable } from "../../components/table.js";
import { renderUserEdit } from "./user-edit.js";
import { renderButton } from "../../components/button.js"; // botão customizado

export async function loadUser() {
  const content = document.getElementById("card-data");
  document.getElementById("pageTitle").innerText = "Users";

  showLoading(content, "Loading Users...");

  const service = new UserService();
  const loginService = new LoginService();
  const userLogged = loginService.getLoggedUser();
  const data = await service.getByCongregation(userLogged.congregation_number);

  hideLoading(content);

  renderTable({
    container: content,
    columns: [
      { key: "name", label: "Name", width: "150px" },
      { key: "user", label: "Usuario", width: "100px" },
      { key: "password", label: "Contraseña", width: "100px" },
      { key: "active", label: "Activo", width: "80px" },
    ],
    data,
    rowsOptions: [15, 30, 60, 100, 150],
    tableHeight: null,
    disableDelete: true,
    onView: (user) => renderUserEdit(content, user, true),
    onEdit: (user) => renderUserEdit(content, user),
    onDelete: (id) => {
      if (confirm("Are you sure you want to delete user " + id + "?")) {
        alert("Deleted User " + id);
      }
    },
    extraButtons: [
      (user) => createDeactivateUserButton(user, service, content, data),
    ],
  });

  setupAddButton(content);
}

/* 🔹 FUNÇÃO DE ALTERAR STATUS */
async function onClickUserActivDeactivate(user, service, container) {
  const newStatus = !user.active;
  try {
    showLoading(container, "Actualizando status...");
    await service.put({ ...user, active: newStatus });
    user.active = newStatus;

    await loadUser();
  } catch (err) {
    alert("Error updating status: " + err.message);
  } finally {
    hideLoading(container);
  }
}

/* 🔹 BOTÃO CUSTOMIZADO PARA ALTERAR ACTIVE */
function createDeactivateUserButton(user, service, container) {
  return renderButton({
    iconClass: user.active ? "fas fa-toggle-on" : "fas fa-toggle-off",
    colorClass: user.active ? "btn-success" : "btn-secondary",
    title: user.active ? "Desactivar" : "Activar",
    onClick: () => onClickUserActivDeactivate(user, service, container),
    extraAttributes: { "data-action": "toggle", "data-id": user.id },
  });
}

/* 🔹 FUNÇÃO PARA CONFIGURAR O BOTÃO "ADICIONAR" */
function setupAddButton(content) {
  const btnAdd = document.getElementById("btnAdd");
  if (!btnAdd) return;

  btnAdd.classList.remove("noneButton");

  btnAdd.onclick = (e) => {
    e.preventDefault();

    const newUser = {
      id: null,
      name: "",
      user: "",
      password: "",
      active: true,
      type: "PUBLISHER",
    };

    renderUserEdit(content, newUser);
  };
}
