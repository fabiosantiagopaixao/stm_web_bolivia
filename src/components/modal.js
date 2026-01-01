export function showConfirmModal({
  id,
  title = "Modal Title",
  message = "Message",
  primaryLabel = "OK",
  secondaryLabel = "Cancel",
  onPrimary = () => {},
  onSecondary = () => {},
}) {
  // Cria o HTML do modal
  const modalHTML = `
    <div class="modal fade" id="${id}" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div class="modal-body">${message}</div>
          <div class="modal-footer">
            <button id="${id}-secondary" class="btn btn-danger" type="button">${secondaryLabel}</button>
            <button id="${id}-primary" class="btn btn-primary" type="button">${primaryLabel}</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Adiciona no body
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modal = document.getElementById(id);
  const btnPrimary = document.getElementById(`${id}-primary`);
  const btnSecondary = document.getElementById(`${id}-secondary`);
  const btnClose = modal.querySelector(".close");

  // Funções dos botões
  btnPrimary.addEventListener("click", () => {
    onPrimary();
    hideModal(modal);
  });

  btnSecondary.addEventListener("click", () => {
    onSecondary();
    hideModal(modal);
  });

  btnClose.addEventListener("click", () => hideModal(modal));

  // Função para abrir o modal
  function showModal() {
    modal.classList.add("show");
    modal.style.display = "block";
    modal.setAttribute("aria-modal", "true");
    modal.removeAttribute("aria-hidden");
    document.body.classList.add("modal-open");

    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop fade show";
    backdrop.id = `${id}-backdrop`;
    document.body.appendChild(backdrop);
  }

  function hideModal(modalEl) {
    modalEl.classList.remove("show");
    modalEl.style.display = "none";
    modalEl.setAttribute("aria-hidden", "true");
    modalEl.removeAttribute("aria-modal");
    document.body.classList.remove("modal-open");

    const backdrop = document.getElementById(`${id}-backdrop`);
    if (backdrop) backdrop.remove();
  }

  return { show: showModal, hide: () => hideModal(modal) };
}
