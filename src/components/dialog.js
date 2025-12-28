export function showDialog({
  type = "INFO",                 // INFO | ERROR | ALERT
  message = "",
  okLabel = "OK",
  onOk = null,
  enableNegativeButton = false,
  noLabel = "No"
}) {
  // Remove dialog anterior se existir
  const existing = document.getElementById("app-dialog-overlay");
  if (existing) existing.remove();

  /* Configuração por tipo */
  const config = {
    INFO: {
      color: "primary",
      icon: "bi-info-circle-fill"
    },
    ERROR: {
      color: "danger",
      icon: "bi-x-octagon-fill"
    },
    ALERT: {
      color: "warning",
      icon: "bi-exclamation-triangle-fill"
    }
  };

  const { color, icon } = config[type] || config.INFO;

  /* Overlay */
  const overlay = document.createElement("div");
  overlay.id = "app-dialog-overlay";
  overlay.className =
    "position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center";
  overlay.style.background = "rgba(0,0,0,0.5)";
  overlay.style.zIndex = "1055";

  /* Dialog */
  overlay.innerHTML = `
    <div class="card shadow border-0" style="width: 380px;">
      <div class="card-body p-4">

        <div class="text-center mb-3 text-${color}">
          <i class="bi ${icon}" style="font-size: 3rem;"></i>
        </div>

        <div class="text-center fw-bold text-${color} mb-2">
          ${type}
        </div>

        <div class="text-center text-secondary mb-4">
          ${message}
        </div>

        <div class="d-flex justify-content-end gap-2">
          ${
            enableNegativeButton
              ? `<button id="dialogNoBtn" class="btn btn-outline-danger">
                   <i class="bi bi-x-circle me-1"></i> ${noLabel}
                 </button>`
              : ""
          }

          <button id="dialogOkBtn" class="btn btn-primary">
            <i class="bi bi-check-circle me-1"></i> ${okLabel}
          </button>
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  /* Fechar dialog */
  const closeDialog = () => overlay.remove();

  /* OK */
  document.getElementById("dialogOkBtn").addEventListener("click", () => {
    closeDialog();
    if (typeof onOk === "function") onOk();
  });

  /* NO (sem callback externo) */
  if (enableNegativeButton) {
    document
      .getElementById("dialogNoBtn")
      .addEventListener("click", closeDialog);
  }
}
