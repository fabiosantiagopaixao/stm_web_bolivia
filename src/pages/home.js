export function loadHome() {
  document.getElementById("pageTitle").innerText = "Home";
  document.getElementById("card-data").innerHTML = `
    <div class="container mt-5">
      <div class="text-center">
        <h1 class="display-4 mb-3">Welcome to STM - Admin Panel</h1>
        <p class="lead">Select a menu option from the sidebar to start managing data.</p>
      </div>
    </div>
  `;
}
