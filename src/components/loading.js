// src/components/loading.js

export function showLoading(container = null, message = "Loading...") {
  if (container) {
    // Usa o container existente
    container.innerHTML = `
      <div class="d-flex flex-column justify-content-center align-items-center text-center"
           style="height: 100%; min-height: 200px;">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="visually-hidden"></span>
        </div>
        <div class="fw-bold text-primary">${message}</div>
      </div>
    `;
  } else {
    // Cria overlay global
    let overlay = document.getElementById("app-loading-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "app-loading-overlay";
      overlay.style.position = "fixed";
      overlay.style.top = 0;
      overlay.style.left = 0;
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.background = "rgba(255,255,255,0.8)";
      overlay.style.display = "flex";
      overlay.style.flexDirection = "column";
      overlay.style.justifyContent = "center";
      overlay.style.alignItems = "center";
      overlay.style.zIndex = 9999;
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = `
      <div class="spinner-border text-primary mb-3" role="status">
        <span class="visually-hidden"></span>
      </div>
      <div class="fw-bold text-primary">${message}</div>
    `;
  }
}

export function hideLoading(container = null) {
  if (container) {
    container.innerHTML = "";
  } else {
    const overlay = document.getElementById("app-loading-overlay");
    if (overlay) overlay.remove();
  }
}
