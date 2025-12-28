import { loadHome } from "./pages/home.js";
import { loadCongregation } from "./pages/congregation/index.js";
import { renderCongregationsEdit } from "./pages/congregation/congregation-edit.js";
import { loadUser } from "./pages/user/index.js";
import { renderUserEdit } from "./pages/user/user-edit.js";
import { loadTerritory } from "./pages/territory/index.js";
import { renderTerritoryEdit } from "./pages/territory/territory-edit.js";
import { loadAddress } from "./pages/address/index.js";
import { renderAddressEdit } from "./pages/address/address-edit.js";

import { loadNews } from "./pages/news/index.js";
import { renderNewsEdit } from "./pages/news/news-edit.js";
import { loadAssignments } from "./pages/assignments/assignments.js";
import { loadMyAssignments } from "./pages/assignments/my_assigments.js";
import { loadReportS13 } from "./pages/report/report_s13.js";
import { loadAbout } from "./pages/about/index.js";

export function navigateTo(page) {
  if (page === undefined) return
  
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
    congregationEdit: renderCongregationsEdit
  };

  routes[page]?.();
}
