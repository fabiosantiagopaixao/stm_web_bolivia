/**
 * Cria um botão customizado para usar na tabela
 * @param {string} iconClass - classe do ícone (FontAwesome)
 * @param {string} colorClass - classe de cor do botão (btn-primary, btn-success, etc)
 * @param {string} title - tooltip
 * @param {function} onClick - callback do clique
 * @param {string} id - id do item (row.id)
 */
export function renderButton({ iconClass, colorClass, title, onClick, id }) {
  const btn = document.createElement("a");
  btn.href = "#";
  btn.className = `btn ${colorClass} btn-circle btn-sm`;
  btn.dataset.id = id;
  btn.dataset.title = title;

  btn.innerHTML = `<i class="${iconClass}"></i>`;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    onClick && onClick(id);
  });

  return btn;
}
