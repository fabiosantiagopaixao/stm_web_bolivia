import { navigateTo } from "./route.js";

// Home padrão
navigateTo("home");

// Listener para navegação do menu
document.addEventListener("click", (event) => {
  const link = event.target.closest("[data-page]");
  if (!link) return;

  event.preventDefault();

  const page = link.getAttribute("data-page");
  navigateTo(page);

  // Atualiza menu ativo (opcional)
  document.querySelectorAll(".nav-item").forEach(item =>
    item.classList.remove("active")
  );
  link.closest(".nav-item")?.classList.add("active");
});
