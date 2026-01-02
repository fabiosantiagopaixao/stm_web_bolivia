import { TerritoryService } from "../../api/services/TerritoryService.js";
import { showLoading, hideLoading } from "../../components/loading.js";
import { renderTable } from "../../components/table.js";
import { renderTerritoryEdit } from "./territory-edit.js";
import { showConfirmModal } from "../../components/modal.js";
import { setUpButtonAdd } from "../util/PagesUtil.js";

export async function loadTerritory() {
  const content = document.getElementById("card-data");
  document.getElementById("pageTitle").innerText = "Territorios";

  showLoading(content, "Cargando Territorios...");

  const service = new TerritoryService();

  const data = await service.getByCongregation();

  hideLoading(content);

  renderTable({
    container: content,
    columns: [
      { key: "number", label: "Número" },
      { key: "name", label: "Nombre" },
      { key: "type", label: "Tipo" },
    ],
    data,
    rowsOptions: [15, 30, 60, 100, 150],

    onView: (territory) => renderTerritoryEdit(content, territory, true),

    onEdit: (territory) => renderTerritoryEdit(content, territory),

    onDelete: (territory) => onShowDialogDelete(territory, content),
  });

  setUpButtonAdd({
    buttonId: "btnAdd", // id do botão
    content, // referência ao container/card
    onClick: (content) => {
      // função de clique personalizada
      const newTerritory = {
        id: null,
        number: "",
        name: "",
        password: "",
        type: "HOUSE_TO_HOUSE",
      };
      renderTerritoryEdit(content, newTerritory);
    },
  });
}

function onShowDialogDelete(territory, content) {
  const confirmodal = showConfirmModal({
    title: "Eliminar Territorio",
    message: `¿Está seguro que desea eliminar el territorio <b>${territory.number}</b>?`,
    confirmText: "Sí",
    cancelText: "No",
    onConfirm: () => onDeleteYes(territory, content),
  });
  confirmodal.show();
}

async function onDeleteYes(territory, content) {
  const service = new TerritoryService();

  showLoading(content, "Eliminando territorio...");

  await service.delete(territory.id);

  hideLoading(content);

  loadTerritory(); // recarrega a tabela
}
