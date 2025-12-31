import { loadHome } from "./home/content-home.js";
import { loadCongregation } from "./congregation/index.js";
import { renderCongregationsEdit } from "./congregation/congregation-edit.js";
import { loadUser } from "./user/index.js";
import { renderUserEdit } from "./user/user-edit.js";
import { loadTerritory } from "./territory/index.js";
import { renderTerritoryEdit } from "./territory/territory-edit.js";
import { loadAddress } from "./address/index.js";
import { renderAddressEdit } from "./address/address-edit.js";

import { loadNews } from "./news/index.js";
import { renderNewsEdit } from "./news/news-edit.js";
import { loadAssignments } from "./assignments/assignments.js";
import { loadMyAssignments } from "./assignments/my_assigments.js";
import { loadReportS13 } from "./report/report_s13.js";
import { loadAbout } from "./about/index.js";

export function navigateTo(page) {
  if (!page) return;

  const routes = {
    home: loadHome,
    user: loadUser,
    userEdit: renderUserEdit,
    territory: loadTerritory,
    territoryEdit: renderTerritoryEdit,
    address: loadAddress,
    addressEdit: renderAddressEdit,
    news: loadNews,
    newsEdit: renderNewsEdit,
    assignments: loadAssignments,
    my_assignments: loadMyAssignments,
    report_s13: loadReportS13,
    about: loadAbout,
    congregation: loadCongregation,
    congregationEdit: renderCongregationsEdit,
  };

  // chama a função correspondente
  routes[page]?.();
}

// função para inicializar SPA default home
export function initRouteDefault() {
  loadHome(); // carrega home ao abrir a página
}
