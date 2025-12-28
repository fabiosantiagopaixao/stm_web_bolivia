export function renderAlertModal(container, options = {}) {
  const {
    id = "alertModal",
    type = "INFO", // INFO | ERROR | WARNING
    title = "Attention",
    message = "",
    buttons = [{ text: "OK", className: "btn btn-primary", dismiss: true }],
  } = options;

  const oldModal = document.getElementById(id);
  if (oldModal) oldModal.remove();

  // Define ícone e cor de acordo com o tipo
  let iconHtml = "";
  switch (type.toUpperCase()) {
    case "ERROR":
      iconHtml = `<i class="fas fa-times-circle text-danger fa-2x mr-2"></i>`;
      break;
    case "WARNING":
      iconHtml = `<i class="fas fa-exclamation-triangle text-warning fa-2x mr-2"></i>`;
      break;
    case "INFO":
    default:
      iconHtml = `<i class="fas fa-info-circle text-primary fa-2x mr-2"></i>`;
      break;
  }

  const modalHtml = document.createElement("div");
  modalHtml.className = "modal fade";
  modalHtml.id = id;
  modalHtml.tabIndex = -1;
  modalHtml.setAttribute("role", "dialog");
  modalHtml.innerHTML = `
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${iconHtml}${title}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">${message}</div>
        <div class="modal-footer">
          ${buttons
            .map(
              (btn, i) => `
            <button type="button" class="${
              btn.className
            }" id="${id}-btn-${i}" ${btn.dismiss ? 'data-dismiss="modal"' : ""}>
              ${btn.text}
            </button>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;

  container.appendChild(modalHtml);

  // Adiciona eventos de ação
  buttons.forEach((btn, i) => {
    if (btn.action) {
      document
        .getElementById(`${id}-btn-${i}`)
        .addEventListener("click", btn.action);
    }
  });

  return $(`#${id}`);
}
