// components/table.js
import { renderButton } from "./button.js";

/* 🔹 BASE PATH (Vite) */
let BASE_PATH = import.meta.env.BASE_URL || "/";
if (BASE_PATH.endsWith("/")) BASE_PATH = BASE_PATH.slice(0, -1);

export function renderTable({
  container,
  columns,
  data: initialData,
  onView,
  onEdit,
  onDelete,
  disableEdit = false,
  disableDelete = false,
  rowsOptions = [15, 30, 60, 100],
  extraButtons = [],
}) {
  let currentPage = 1;
  let rowsPerPage = rowsOptions[0];
  let data = [...initialData];
  let filteredData = [...data];
  let sortConfig = { key: null, direction: "asc" };

  container.innerHTML = `
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div style="flex-grow:1;margin-right:20px;margin-top:-10px;">
          <input type="search" id="tableSearch"
            class="form-control form-control-sm w-100"
            placeholder="Buscar">
        </div>
        <div>
          <label>Mostrando
            <select id="rowsPerPage"
              class="form-select form-select-sm d-inline-block w-auto">
              ${rowsOptions
                .map(
                  (opt) =>
                    `<option value="${opt}" ${
                      opt === rowsPerPage ? "selected" : ""
                    }>${opt}</option>`
                )
                .join("")}
            </select>
          lineas</label>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-bordered table-hover">
          <thead>
            <tr>
              ${columns
                .map(
                  (c) =>
                    `<th data-key="${c.key}" style="cursor:pointer">
                      ${c.label} <i class="fas fa-sort"></i>
                    </th>`
                )
                .join("")}
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody id="tableBody"></tbody>
        </table>
      </div>

      <div class="d-flex justify-content-between align-items-center mt-3">
        <div id="tableInfo"></div>
        <ul class="pagination mb-0" id="pagination"></ul>
      </div>
    </div>
  `;

  const rowsSelect = container.querySelector("#rowsPerPage");
  const searchInput = container.querySelector("#tableSearch");
  const tbody = container.querySelector("#tableBody");
  const tableInfo = container.querySelector("#tableInfo");
  const pagination = container.querySelector("#pagination");
  const headers = container.querySelectorAll("th[data-key]");

  function renderCellValue(value) {
    if (value === true)
      return `<span class="text-success"><i class="fas fa-check-circle"></i></span>`;
    if (value === false)
      return `<span class="text-danger"><i class="fas fa-times-circle"></i></span>`;
    return value ?? "";
  }

  function sortData() {
    if (!sortConfig.key) return;
    filteredData.sort((a, b) => {
      const A = a[sortConfig.key];
      const B = b[sortConfig.key];
      if (A == null) return 1;
      if (B == null) return -1;
      return sortConfig.direction === "asc"
        ? String(A).localeCompare(String(B))
        : String(B).localeCompare(String(A));
    });
  }

  function renderTableBody() {
    sortData();

    const totalRows = filteredData.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    if (currentPage > totalPages) currentPage = totalPages || 1;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
    const pageData = filteredData.slice(startIndex, endIndex);

    tbody.innerHTML = "";

    pageData.forEach((row) => {
      const tr = document.createElement("tr");

      // 🔹 NÃO ALTERA A ESTRUTURA DAS COLUNAS
      columns.forEach((c) => {
        const td = document.createElement("td");
        if (c.width) td.style.width = c.width;

        let cellValue = row[c.key];

        if (c.key === "type") {
          if (cellValue === "HOUSE_TO_HOUSE") {
            cellValue = `<a data-title="Casa en Casa">
              <img src="${BASE_PATH}/img/house.png"
                   style="width:50px;height:50px;">
            </a>`;
          } else if (cellValue === "PHONE") {
            cellValue = `<a data-title="Teléfono">
              <img src="${BASE_PATH}/img/phone.png"
                   style="width:50px;height:50px;">
            </a>`;
          }
        }

        if (c.key === "gender") {
          const ageType = row["age_type"];
          const genderMap = {
            Male: {
              CHILD: "child_man.png",
              YOUNG: "young_man.png",
              ADULT: "man.png",
              SENIOR: "senior_man.png",
            },
            Female: {
              CHILD: "child_woman.png",
              YOUNG: "young_woman.png",
              ADULT: "woman.png",
              SENIOR: "senior_woman.png",
            },
          };
          const g = cellValue === "Male" ? "Male" : "Female";
          cellValue = `<a class="photo">
            <img src="${BASE_PATH}/img/${genderMap[g][ageType]}"
                 style="width:50px;height:50px;">
          </a>`;
        }

        td.innerHTML = renderCellValue(cellValue);
        tr.appendChild(td);
      });

      const tdActions = document.createElement("td");
      tdActions.className = "text-end text-nowrap";

      const buttons = [];
      if (onView)
        buttons.push(
          renderButton({
            iconClass: "fas fa-eye",
            colorClass: "btn-info",
            title: "Visualizar",
            onClick: () => onView(row),
          })
        );
      if (onEdit && !disableEdit)
        buttons.push(
          renderButton({
            iconClass: "fas fa-edit",
            title: "Editar",
            colorClass: "btn-warning",
            onClick: () => onEdit(row),
          })
        );
      if (onDelete && !disableDelete)
        buttons.push(
          renderButton({
            iconClass: "fas fa-trash",
            title: "Deletar",
            colorClass: "btn-danger",
            onClick: () => onDelete(row),
          })
        );

      extraButtons.forEach((fn) => {
        const btn = fn(row);
        if (btn instanceof HTMLElement) buttons.push(btn);
      });

      buttons.forEach((btn, i) => {
        if (i) btn.style.marginLeft = "4px";
        tdActions.appendChild(btn);
      });

      tr.appendChild(tdActions);
      tbody.appendChild(tr);
    });

    tableInfo.textContent = `Mostrando ${
      startIndex + 1
    } hasta ${endIndex} de ${totalRows} lineas`;

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    pagination.innerHTML = "";

    function page(label, disabled, cb, active = false) {
      const li = document.createElement("li");
      li.className = `page-item ${disabled ? "disabled" : ""} ${
        active ? "active" : ""
      }`;
      const a = document.createElement("a");
      a.href = "#";
      a.className = "page-link";
      a.textContent = label;
      a.onclick = (e) => {
        e.preventDefault();
        if (!disabled) cb();
      };
      li.appendChild(a);
      return li;
    }

    pagination.appendChild(
      page("Previous", currentPage === 1, () => {
        currentPage--;
        renderTableBody();
      })
    );

    for (let i = 1; i <= totalPages; i++) {
      pagination.appendChild(
        page(
          i,
          false,
          () => {
            currentPage = i;
            renderTableBody();
          },
          i === currentPage
        )
      );
    }

    pagination.appendChild(
      page("Next", currentPage === totalPages, () => {
        currentPage++;
        renderTableBody();
      })
    );
  }

  headers.forEach((th) => {
    th.onclick = () => {
      const key = th.dataset.key;
      if (sortConfig.key === key) {
        sortConfig.direction = sortConfig.direction === "asc" ? "desc" : "asc";
      } else {
        sortConfig.key = key;
        sortConfig.direction = "asc";
      }

      headers.forEach((h) => {
        const i = h.querySelector("i");
        if (!i) return;
        i.className =
          h.dataset.key === key
            ? sortConfig.direction === "asc"
              ? "fas fa-sort-up"
              : "fas fa-sort-down"
            : "fas fa-sort";
      });

      renderTableBody();
    };
  });

  rowsSelect.onchange = (e) => {
    rowsPerPage = Number(e.target.value);
    currentPage = 1;
    renderTableBody();
  };

  searchInput.oninput = (e) => {
    const term = e.target.value.toLowerCase();
    filteredData = data.filter((row) =>
      columns.some((c) =>
        String(row[c.key] ?? "")
          .toLowerCase()
          .includes(term)
      )
    );
    currentPage = 1;
    renderTableBody();
  };

  renderTableBody();
}
