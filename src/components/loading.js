export function showLoading(container = null, message = "Loading...") {
  if (container) {
    container.innerHTML = `
      <div class="d-flex flex-column justify-content-center align-items-center text-center"
           style="height: 100%; min-height: 200px;">
        <div class="spinner-border text-primary mb-3"></div>
        <div class="fw-bold text-primary">${message}</div>
      </div>
    `;
    return;
  }

  let overlay = document.getElementById("app-loading-overlay");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "app-loading-overlay";
    document.body.appendChild(overlay);
  }

  // 🔥 SEMPRE aplica os estilos (mesmo se já existir)
  Object.assign(overlay.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(255,255,255,0.85)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  });

  overlay.innerHTML = `
    <div class="spinner-border text-primary mb-3"></div>
    <div class="fw-bold text-primary">${message}</div>
  `;
}

export function hideLoading() {
  const overlay = document.getElementById("app-loading-overlay");
  if (overlay) overlay.remove();
}
