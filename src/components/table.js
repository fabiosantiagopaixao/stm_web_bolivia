export function renderTable({
  container,
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  disableEdit = false,
  disableDelete = false,
  rowsOptions = [15, 30, 60, 100],
}) {
  let currentPage = 1;
  let rowsPerPage = rowsOptions[0];

  /* ================= Helpers ================= */

  function renderCellValue(value) {
    if (value === true) {
      return `
        <span class="text-success" title="Activo">
          <i class="fas fa-check-circle"></i>
        </span>
      `;
    }

    if (value === false) {
      return `
        <span class="text-danger" title="Inactivo">
          <i class="fas fa-times-circle"></i>
        </span>
      `;
    }

    return value ?? "";
  }

  function isBooleanData(value) {
    return typeof value === "boolean";
  }

  function getHeaderClass(label) {
    return label?.toLowerCase() === "activo" ? "text-center" : "";
  }

  /* ================= Render ================= */

  function render() {
    const totalRows = data.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
    const paginatedData = data.slice(startIndex, endIndex);

    container.innerHTML = `
      <div class="card shadow mb-4">
        <div class="card-body">

          <!-- Rows per page -->
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              Show
              <select id="rowsPerPage" class="form-select form-select-sm d-inline w-auto">
                ${rowsOptions
                  .map(
                    (opt) => `
                  <option value="${opt}" ${
                      opt === rowsPerPage ? "selected" : ""
                    }>
                    ${opt}
                  </option>
                `
                  )
                  .join("")}
              </select>
              entries
            </div>
          </div>

          <!-- Table -->
          <div class="table-responsive">
            <table id="dataTable" class="table table-bordered table-hover">
              <thead>
                <tr>
                  ${columns
                    .map(
                      (c) => `
                    <th class="${getHeaderClass(c.label)}">
                      ${c.label}
                    </th>
                  `
                    )
                    .join("")}
                  <th class="text-end" style="width:140px">Actions</th>
                </tr>
              </thead>

              <tbody>
                ${paginatedData
                  .map(
                    (row) => `
                  <tr>
                    ${columns
                      .map(
                        (c) => `
                      <td class="${
                        isBooleanData(row[c.key]) ? "text-center" : ""
                      }">
                        ${renderCellValue(row[c.key])}
                      </td>
                    `
                      )
                      .join("")}

                    <td class="text-end text-nowrap">

                      <!-- View -->
                      ${
                        onView
                          ? `
                        <a href="#"
                           class="btn btn-info btn-circle btn-sm"
                           data-id="${row.id}"
                           data-action="view">
                          <i class="fas fa-eye"></i>
                        </a>
                      `
                          : ""
                      }

                      <!-- Edit -->
                      ${
                        onEdit && !disableEdit
                          ? `
                        <a href="#"
                           class="btn btn-warning btn-circle btn-sm"
                           data-id="${row.id}"
                           data-action="edit">
                          <i class="fas fa-edit"></i>
                        </a>
                      `
                          : ""
                      }

                      <!-- Delete -->
                      ${
                        onDelete && !disableDelete
                          ? `
                        <a href="#"
                           class="btn btn-danger btn-circle btn-sm"
                           data-id="${row.id}"
                           data-action="delete">
                          <i class="fas fa-trash"></i>
                        </a>
                      `
                          : ""
                      }

                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>

          <!-- Footer -->
          <div class="row align-items-center mt-3">
            <div class="col-md-5">
              <div class="dataTables_info">
                Showing ${startIndex + 1} to ${endIndex} of ${totalRows} entries
              </div>
            </div>

            <div class="col-md-7">
              <ul class="pagination justify-content-end mb-0" id="pagination"></ul>
            </div>
          </div>

        </div>
      </div>
    `;

    /* ===== Rows per page ===== */
    container.querySelector("#rowsPerPage").addEventListener("change", (e) => {
      rowsPerPage = Number(e.target.value);
      currentPage = 1;
      render();
    });

    /* ===== Pagination ===== */
    const pagination = container.querySelector("#pagination");
    pagination.innerHTML = "";

    pagination.appendChild(
      createPageButton("Previous", currentPage === 1, () => {
        currentPage--;
        render();
      })
    );

    for (let i = 1; i <= totalPages; i++) {
      pagination.appendChild(
        createPageButton(i, i === currentPage, () => {
          currentPage = i;
          render();
        })
      );
    }

    pagination.appendChild(
      createPageButton("Next", currentPage === totalPages, () => {
        currentPage++;
        render();
      })
    );

    /* ===== Actions ===== */
    container.querySelectorAll("a[data-action]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (btn.classList.contains("disabled")) return;

        const action = btn.dataset.action;
        const id = btn.dataset.id;
        const rowData = data.find((r) => r.id == id); // pega o objeto completo

        if (action === "view" && onView) onView(rowData);
        if (action === "edit" && onEdit) onEdit(rowData);
        if (action === "delete" && onDelete) onDelete(rowData);
      });
    });
  }

  function createPageButton(label, disabled, onClick) {
    const li = document.createElement("li");
    li.className = `page-item ${disabled ? "disabled" : ""} ${
      label === currentPage ? "active" : ""
    }`;

    const a = document.createElement("a");
    a.href = "#";
    a.className = "page-link";
    a.textContent = label;

    a.addEventListener("click", (e) => {
      e.preventDefault();
      if (!disabled) onClick();
    });

    li.appendChild(a);
    return li;
  }

  render();
}
