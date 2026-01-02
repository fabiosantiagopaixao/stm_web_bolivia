export function removeAddButton() {
  const btnAdd = document.getElementById("btnAdd");
  if (!btnAdd) return;

  btnAdd.classList.add("noneButton");
}

export function setUpButtonAdd({ buttonId = "btnAdd", content, onClick }) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  btn.classList.remove("noneButton");

  btn.onclick = (e) => {
    e.preventDefault();
    if (typeof onClick === "function") {
      onClick(content);
    }
  };
}
