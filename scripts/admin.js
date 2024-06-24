// Get the transaction type from the URL query parameters
const usermode = JSON.parse(localStorage.getItem("usermode-user"));
console.log(usermode);
if (usermode !== null) {
  const usermodeClose = document.querySelector(".usermode-close");
  usermodeClose.classList.remove("d-none");
  const headingrightsidediv = document.querySelector(".left-side-heading p");
  headingrightsidediv.textContent = `Admin Dashboard [Active User - ${usermode.firstName}]`;
  window.usermodeAccounts = [];
  const getAccounts = async () => {
    try {
      const response = await axios.get(
        `${config.API_URL}/Admin/get-all-accounts/${usermode.id}`,
        {
          withCredentials: true,
        }
      );
      window.usermodeAccounts = response.data.map((account) => account.id);
    } catch (err) {
      console.log(err);
    }
  };
  getAccounts();
}
const userDiv = document.getElementById("users");
const accountDiv = document.getElementById("accounts");
const transactionsDiv = document.getElementById("transactions");
const loansDiv = document.getElementById("loans");
const allAccounts = document.getElementById("all-accounts");

// Event listener for the user card click
userDiv.addEventListener("click", async () => {
  let elements = document.querySelectorAll(
    "#users, #accounts, #transactions, #loans, #all-accounts"
  );
  elements.forEach((element) => {
    element.classList.add("border-dark-subtle");
  });
  userDiv.classList.remove("border-dark-subtle");
  userDiv.classList.add("border-dark");

  const skeletonContainer = document.querySelector(".skeleton-container");
  skeletonContainer.classList.contains("d-none")
    ? skeletonContainer.classList.remove("d-none")
    : skeletonContainer.classList.add("d-none");

  try {
    const res = await axios.get(`${config.API_URL}/Admin/get-all-user`, {
      withCredentials: true,
    });

    let activeUsers = res.data.filter((user) => user.isActive);
    let inactiveUsers = res.data.filter((user) => !user.isActive);

    activeUsers.sort(
      (a, b) => new Date(a.createdDate) - new Date(b.createdDate)
    );
    inactiveUsers.sort(
      (a, b) => new Date(a.createdDate) - new Date(b.createdDate)
    );

    let sortedData = [...inactiveUsers, ...activeUsers];
    res.data = sortedData;
    // Sort by id if usermode is not null

    if (usermode !== null) {
      res.data = res.data.filter((item) => item.id === usermode.id);
    }

    // Select the right-side div
    const rightSideDiv = document.querySelector(".right-side");
    // Clear the right-side div
    rightSideDiv.innerHTML = "";

    // Create a table to display the user details
    const table = document.createElement("table");
    table.className = "table";

    const inputGroupDiv = document.createElement("div");
    inputGroupDiv.className = "input-group mb-3 px-3 pt-3";
    inputGroupDiv.innerHTML = `
        <input type="text" class="table-search form-control bg-transparent border border-dark-subtle" placeholder="Search" aria-label="Recipient's username" aria-describedby="button-addon2">
        <button class="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>
      `;
    rightSideDiv.appendChild(inputGroupDiv);

    document.querySelector(".table-search").addEventListener("input", (e) => {
      if (e.target.value.length > 2) {
        const searchValue = e.target.value.toLowerCase();
        const filteredData = res.data.filter((user) =>
          Object.values(user).some((value) => {
            if (
              typeof value === "string" &&
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+$/.test(value)
            ) {
              value = new Date(value).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              });
            }
            return (
              value !== null &&
              value.toString().toLowerCase().includes(searchValue)
            );
          })
        );
        renderUserTableBody(filteredData, tbody);
      } else {
        renderUserTableBody(res.data, tbody);
      }
    });

    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    let headers = [
      "ID↑↓",
      "First Name↑↓",
      "Contact↑↓",
      "Created Date↑↓",
      "Details",
    ];
    let sortDirections = {
      "ID↑↓": false,
      "First Name↑↓": false,
      "Contact↑↓": false,
      "Created Date↑↓": false,
    };
    let mapdata = {
      "ID↑↓": "id",
      "First Name↑↓": "firstName",
      "Contact↑↓": "contact",
      "Created Date↑↓": "createdDate",
    };

    headers.forEach((header) => {
      const th = document.createElement("th");
      th.scope = "col";
      th.textContent = `${header}`;
      tr.appendChild(th);
      th.style.cursor = "pointer";

      if (header !== "Details") {
        th.addEventListener("click", () => {
          sortDirections[header] = !sortDirections[header];

          res.data.sort((a, b) => {
            if (typeof a[mapdata[header]] === "string") {
              return sortDirections[header]
                ? a[mapdata[header]].localeCompare(b[mapdata[header]])
                : b[mapdata[header]].localeCompare(a[mapdata[header]]);
            } else {
              return sortDirections[header]
                ? new Date(a[mapdata[header]]) - new Date(b[mapdata[header]])
                : new Date(b[mapdata[header]]) - new Date(a[mapdata[header]]);
            }
          });

          renderUserTableBody(res.data, tbody);
        });
      }
    });

    thead.appendChild(tr);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    renderUserTableBody(res.data, tbody);
    table.appendChild(tbody);

    rightSideDiv.appendChild(table);
    rightSideDiv.appendChild(skeletonContainer);
    skeletonContainer.classList.add("d-none");
  } catch (err) {
    console.log(err);
  }
});

function renderUserTableBody(userData, tbody) {
  tbody.innerHTML = "";

  userData.forEach((user) => {
    const tr = document.createElement("tr");
    [
      user.id,
      user.firstName,
      user.contact,
      new Date(user.createdDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    ].forEach((data) => {
      const td = document.createElement("td");
      td.textContent = data;
      tr.appendChild(td);
    });

    const td = document.createElement("td");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = user.isActive
      ? "btn btn-secondary my-auto"
      : "btn btn-dark my-auto";
    btn.dataset.bsToggle = "modal";
    btn.dataset.bsTarget = `#modal-${user.id}`;
    btn.textContent = "Details";
    td.appendChild(btn);
    tr.appendChild(td);

    tbody.appendChild(tr);

    createUserModal(user);
  });
}

function createUserModal(user) {
  const rightSideDiv = document.querySelector(".right-side");

  const modal = document.createElement("div");
  modal.className = "modal fade";
  modal.id = `modal-${user.id}`;
  modal.tabIndex = "-1";
  modal.ariaLabelledby = `modal-${user.id}-label`;
  modal.ariaHidden = "true";
  rightSideDiv.appendChild(modal);

  const modalDialog = document.createElement("div");
  modalDialog.className = "modal-dialog";
  modal.appendChild(modalDialog);

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";
  modalDialog.appendChild(modalContent);

  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";
  modalContent.appendChild(modalHeader);

  const modalTitle = document.createElement("h5");
  modalTitle.className = "modal-title";
  modalTitle.id = `modal-${user.id}-label`;
  modalTitle.textContent = `User - ${user.id}`;
  modalHeader.appendChild(modalTitle);

  const modalBody = document.createElement("div");
  modalBody.className = "modal-body";
  modalContent.appendChild(modalBody);

  const p1 = document.createElement("p");
  p1.textContent = `First Name: ${user.firstName}`;
  modalBody.appendChild(p1);

  const p2 = document.createElement("p");
  p2.textContent = `Last Name: ${user.lastName}`;
  modalBody.appendChild(p2);

  const p12 = document.createElement("p");
  p12.textContent = `User Name: ${user.username}`;
  modalBody.appendChild(p12);

  const p13 = document.createElement("p");
  p13.textContent = `Email : ${user.email}`;
  modalBody.appendChild(p13);

  const p14 = document.createElement("p");
  p14.textContent = `Contact : ${user.contact}`;
  modalBody.appendChild(p14);

  const p31 = document.createElement("p");
  p31.textContent = `Applied Date: ${new Date(
    user.dateOfBirth
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`;
  modalBody.appendChild(p31);

  const p3 = document.createElement("p");
  p3.textContent = `Applied Date: ${new Date(
    user.createdDate
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`;
  modalBody.appendChild(p3);

  const modalFooter = document.createElement("div");
  modalFooter.className = "modal-footer";
  modalContent.appendChild(modalFooter);

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "btn btn-secondary";
  closeButton.dataset.bsDismiss = "modal";
  closeButton.textContent = "Close";

  const userSession = document.createElement("button");
  userSession.type = "button";
  userSession.className = "btn btn-info";
  userSession.textContent = "Track User";
  modalFooter.appendChild(userSession);
  userSession.addEventListener("click", async () => {
    localStorage.setItem("usermode-user", JSON.stringify(user));
    var toastLiveExample = document.getElementById("liveToast");
    var toastHeaderStrong = toastLiveExample.querySelector(
      ".toast-header strong"
    );
    var toastBody = toastLiveExample.querySelector(".toast-body");

    // Edit the toast content
    toastHeaderStrong.innerText = "UserMode Activated!";
    toastBody.innerText = `${user.firstName} ${user.lastName} is now in UserMode \n \n User ID: ${user.id} \n\n Redirecting....`;

    // Show the toast
    var toast = new bootstrap.Toast(toastLiveExample);
    toast.show();
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  });

  if (user.isActive === false) {
    const activateButton = document.createElement("button");
    activateButton.type = "button";
    activateButton.className = "btn btn-dark";
    activateButton.textContent = "Activate";
    modalFooter.appendChild(activateButton);

    activateButton.addEventListener("click", async () => {
      activateButton.disabled = true;
      const activateResponse = await axios.get(
        `${config.ADMIN_URL}/activate/${user.id}`,
        {
          withCredentials: true,
        }
      );
      if (activateResponse.status === 200) {
        activateButton.textContent = "Activated..";
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    });
  }

  modalFooter.appendChild(closeButton);
}

allAccounts.addEventListener("click", async () => {
  let elements = document.querySelectorAll(
    "#users, #accounts, #transactions, #loans, #all-accounts"
  );
  elements.forEach((element) => {
    element.classList.add("border-dark-subtle");
  });
  allAccounts.classList.remove("border-dark-subtle");
  allAccounts.classList.add("border-dark");
  const skeletonContainer = document.querySelector(".skeleton-container");
  skeletonContainer.classList.contains("d-none")
    ? skeletonContainer.classList.remove("d-none")
    : skeletonContainer.classList.add("d-none");
  await axios
    .get(`${config.API_URL}/Admin/get-all-accounts`, {
      withCredentials: true,
    })
    .then((res) => {
      console.log(res.data);
      if (usermode !== null) {
        res.data = res.data.filter((item) => item.userId === usermode.id);
      }
      if (res.data.length === 0) {
        const rightSideDiv = document.querySelector(".right-side");
        rightSideDiv.innerHTML = "";
        const noTransactionsDiv = document.createElement("div");
        noTransactionsDiv.className = "no-transactions";
        const noTransactionsP = document.createElement("p");
        noTransactionsP.textContent = "No accounts found for this user.";
        noTransactionsDiv.appendChild(noTransactionsP);
        rightSideDiv.appendChild(noTransactionsDiv);
        rightSideDiv.appendChild(skeletonContainer);
        skeletonContainer.classList.add("d-none");
        return;
      }
      // Select the right-side div
      const rightSideDiv = document.querySelector(".right-side");

      // Clear the right-side div
      rightSideDiv.innerHTML = "";

      // Create a table to display the loan details
      const table = document.createElement("table");
      table.className = "table ";

      const inputGroupDiv = document.createElement("div");
      inputGroupDiv.className = "input-group mb-3 px-3 pt-3";
      inputGroupDiv.innerHTML = `
        <input type="text" class="table-search form-control bg-transparent border border-dark-subtle" placeholder="Search" aria-label="Recipient's username" aria-describedby="button-addon2">
        <button class="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>
      `;
      rightSideDiv.appendChild(inputGroupDiv);

      document.querySelector(".table-search").addEventListener("input", (e) => {
        if (e.target.value.length > 2) {
          const searchValue = e.target.value.toLowerCase();
          const filteredData = res.data.filter((user) =>
            Object.values(user).some((value) => {
              if (
                typeof value === "string" &&
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+$/.test(value)
              ) {
                value = new Date(value).toLocaleString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                });
              }
              return (
                value !== null &&
                value.toString().toLowerCase().includes(searchValue)
              );
            })
          );
          renderAllAccountTableBody(filteredData, tbody);
        } else {
          renderAllAccountTableBody(res.data, tbody);
        }
      });

      // Create the table header
      const thead = document.createElement("thead");
      const tr = document.createElement("tr");
      let headers = ["ID↑↓", "Account Type↑↓", "Balance↑↓", "Details"];
      let sortDirections = {
        "ID↑↓": false,
        "Account Type↑↓": false,
        "Balance↑↓": false,
      };
      let mapdata = {
        "ID↑↓": "id",
        "Account Type↑↓": "accountType",
        "Balance↑↓": "balance",
      };
      headers.forEach((header) => {
        const th = document.createElement("th");
        th.scope = "col";
        th.textContent = `${header}`;
        tr.appendChild(th);
        th.style.cursor = "pointer";
        if (header !== "Details") {
          th.addEventListener("click", () => {
            sortDirections[header] = !sortDirections[header];
            res.data.sort((a, b) => {
              if (typeof a[mapdata[header]] === "string") {
                return sortDirections[header]
                  ? a[mapdata[header]].localeCompare(b[mapdata[header]])
                  : b[mapdata[header]].localeCompare(a[mapdata[header]]);
              } else {
                return sortDirections[header]
                  ? new Date(a[mapdata[header]]) - new Date(b[mapdata[header]])
                  : new Date(b[mapdata[header]]) - new Date(a[mapdata[header]]);
              }
            });
            renderAllAccountTableBody(res.data, tbody);
          });
        }
      });

      thead.appendChild(tr);
      table.appendChild(thead);

      // Create the table body
      const tbody = document.createElement("tbody");
      renderAllAccountTableBody(res.data, tbody);
      table.appendChild(tbody);
      rightSideDiv.appendChild(table);
      rightSideDiv.appendChild(skeletonContainer);
      skeletonContainer.classList.add("d-none");
    })
    .catch((err) => {
      // console.log(err);
    });
});

function renderAllAccountTableBody(accountData, tbody) {
  tbody.innerHTML = "";

  accountData.forEach((user) => {
    const tr = document.createElement("tr");
    [user.id, user.accountType, user.balance].forEach((data) => {
      const td = document.createElement("td");
      td.textContent = data;
      tr.appendChild(td);
    });

    const td = document.createElement("td");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.bsToggle = "modal";
    btn.dataset.bsTarget = `#modal-${user.accountId}`;
    if (user.isApproved === true) {
      btn.className = "btn btn-dark-subtle my-auto";
      btn.textContent = "Approved";
      btn.disabled = true;
    } else if (user.isRejected === true) {
      btn.className = "btn btn-dark-subtle my-auto";
      btn.textContent = "Rejected";
      btn.disabled = true;
    } else {
      btn.className = "btn btn-dark my-auto";
      btn.textContent = "Details";
    }
    td.appendChild(btn);
    tr.appendChild(td);

    tbody.appendChild(tr);

    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = `modal-${user.accountId}`;
    modal.tabIndex = "-1";
    modal.ariaLabelledby = `modal-${user.accountId}-label`;
    modal.ariaHidden = "true";
    const rightSideDiv = document.querySelector(".right-side");
    rightSideDiv.appendChild(modal);

    const modalDialog = document.createElement("div");
    modalDialog.className = "modal-dialog";
    modal.appendChild(modalDialog);

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    modalDialog.appendChild(modalContent);

    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";
    modalContent.appendChild(modalHeader);

    const modalTitle = document.createElement("h5");
    modalTitle.className = "modal-title";
    modalTitle.id = `modal-${user.id}-label`;
    modalTitle.textContent = `User -  ${user.id}`;
    modalHeader.appendChild(modalTitle);

    const modalBody = document.createElement("div");
    modalBody.className = "modal-body";
    modalContent.appendChild(modalBody);

    const p2 = document.createElement("p");
    p2.textContent = `Account Type: ${user.accountType}`;
    modalBody.appendChild(p2);

    const p12 = document.createElement("p");
    p12.textContent = `Balance: ${user.balance}`;
    modalBody.appendChild(p12);

    const p3 = document.createElement("p");
    p3.textContent = `Created Date: ${new Date(
      user.createdDate
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`;
    modalBody.appendChild(p3);

    const p31 = document.createElement("p");
    p31.textContent = `Updated Date: ${new Date(
      user.updatedDate
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`;
    modalBody.appendChild(p31);

    const p121 = document.createElement("p");
    p121.textContent = `Active: ${user.isActive ? "Yes" : "No"}`;
    modalBody.appendChild(p121);

    const modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer";
    modalContent.appendChild(modalFooter);

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "btn btn-secondary";
    closeButton.dataset.bsDismiss = "modal";
    closeButton.textContent = "Close";

    const loanRepayments = document.createElement("button");
    loanRepayments.type = "button";
    loanRepayments.className = "btn btn-dark";
    loanRepayments.textContent = "Approve";
    modalFooter.appendChild(loanRepayments);

    const loanRepayment = document.createElement("button");
    loanRepayment.type = "button";
    loanRepayment.className = "btn btn-dark";
    loanRepayment.textContent = "Reject";
    modalFooter.appendChild(loanRepayment);

    loanRepayments.addEventListener("click", async () => {
      loanRepayment.disabled = true;
      loanRepayments.disabled = true;
      const repaymentsResponse = await axios.post(
        `${config.API_URL}/Admin/request/approve/close-account/${user.id}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (repaymentsResponse.status === 200) {
        loanRepayments.textContent = "Approved..";
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    });

    loanRepayment.addEventListener("click", async () => {
      loanRepayment.disabled = true;
      loanRepayments.disabled = true;
      const repaymentsResponse = await axios.post(
        `${config.API_URL}/Admin/request/reject/close-account/${user.id}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (repaymentsResponse.status === 200) {
        loanRepayment.textContent = "Rejected..";
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    });

    modalFooter.appendChild(closeButton);
  });
}

accountDiv.addEventListener("click", async () => {
  let elements = document.querySelectorAll(
    "#users, #accounts, #transactions, #loans, #all-accounts"
  );
  elements.forEach((element) => {
    element.classList.add("border-dark-subtle");
  });
  accountDiv.classList.remove("border-dark-subtle");
  accountDiv.classList.add("border-dark");
  const skeletonContainer = document.querySelector(".skeleton-container");
  skeletonContainer.classList.contains("d-none")
    ? skeletonContainer.classList.remove("d-none")
    : skeletonContainer.classList.add("d-none");
  await axios
    .get(`${config.API_URL}/Admin/get-all-accounts-close-request`, {
      withCredentials: true,
    })
    .then((res) => {
      let rejectedUsers = res.data.filter((user) => user.isRejected);
      let approvedUsers = res.data.filter((user) => user.isApproved);
      let pendingUsers = res.data.filter(
        (user) => !user.isRejected && !user.isApproved
      );
      pendingUsers.sort(
        (a, b) => new Date(a.createdDate) - new Date(b.createdDate)
      );
      let sortedData = [...pendingUsers, ...rejectedUsers, , ...approvedUsers];
      res.data = sortedData;
      if (usermode !== null) {
        res.data = res.data.filter((item) =>
          usermodeAccounts.includes(item.accountId)
        );
      }
      if (res.data.length === 0) {
        const rightSideDiv = document.querySelector(".right-side");
        rightSideDiv.innerHTML = "";
        const noTransactionsDiv = document.createElement("div");
        noTransactionsDiv.className = "no-transactions";
        const noTransactionsP = document.createElement("p");
        noTransactionsP.textContent =
          "No closing accounts found for this user.";
        noTransactionsDiv.appendChild(noTransactionsP);
        rightSideDiv.appendChild(noTransactionsDiv);
        rightSideDiv.appendChild(skeletonContainer);
        skeletonContainer.classList.add("d-none");
        return;
      }
      // Select the right-side div
      const rightSideDiv = document.querySelector(".right-side");

      // Clear the right-side div
      rightSideDiv.innerHTML = "";

      // Create a table to display the loan details
      const table = document.createElement("table");
      table.className = "table ";

      const inputGroupDiv = document.createElement("div");
      inputGroupDiv.className = "input-group mb-3 px-3 pt-3";
      inputGroupDiv.innerHTML = `
        <input type="text" class="table-search form-control bg-transparent border border-dark-subtle" placeholder="Search" aria-label="Recipient's username" aria-describedby="button-addon2">
        <button class="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>
      `;
      rightSideDiv.appendChild(inputGroupDiv);

      document.querySelector(".table-search").addEventListener("input", (e) => {
        if (e.target.value.length > 2) {
          const searchValue = e.target.value.toLowerCase();
          const filteredData = res.data.filter((user) =>
            Object.values(user).some((value) => {
              if (
                typeof value === "string" &&
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+$/.test(value)
              ) {
                value = new Date(value).toLocaleString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                });
              }
              return (
                value !== null &&
                value.toString().toLowerCase().includes(searchValue)
              );
            })
          );
          renderAccountTableBody(filteredData, tbody);
        } else {
          renderAccountTableBody(res.data, tbody);
        }
      });

      // Create the table header
      const thead = document.createElement("thead");
      const tr = document.createElement("tr");
      let headers = ["ID↑↓", "Account Type↑↓", "Description↑↓", "Details↑↓"];
      let sortDirections = {
        "ID↑↓": false,
        "Account Type↑↓": false,
        "Description↑↓": false,
      };
      let mapdata = {
        "ID↑↓": "accountId",
        "Account Type↑↓": "accountType",
        "Description↑↓": "description",
      };
      headers.forEach((header) => {
        const th = document.createElement("th");
        th.scope = "col";
        th.textContent = `${header}`;
        tr.appendChild(th);
        th.style.cursor = "pointer";
        if (header !== "Details") {
          th.addEventListener("click", () => {
            sortDirections[header] = !sortDirections[header];
            res.data.sort((a, b) => {
              if (typeof a[mapdata[header]] === "string") {
                return sortDirections[header]
                  ? a[mapdata[header]].localeCompare(b[mapdata[header]])
                  : b[mapdata[header]].localeCompare(a[mapdata[header]]);
              } else {
                return sortDirections[header]
                  ? new Date(a[mapdata[header]]) - new Date(b[mapdata[header]])
                  : new Date(b[mapdata[header]]) - new Date(a[mapdata[header]]);
              }
            });
            renderAccountTableBody(res.data, tbody);
          });
        }
      });

      thead.appendChild(tr);
      table.appendChild(thead);

      // Create the table body
      const tbody = document.createElement("tbody");
      renderAccountTableBody(res.data, tbody);
      table.appendChild(tbody);
      rightSideDiv.appendChild(table);
      rightSideDiv.appendChild(skeletonContainer);
      skeletonContainer.classList.add("d-none");
    })
    .catch((err) => {
      // console.log(err);
    });
});

function renderAccountTableBody(accountData, tbody) {
  tbody.innerHTML = "";

  accountData.forEach((user) => {
    const tr = document.createElement("tr");
    [user.accountId, user.accountType, user.description].forEach((data) => {
      const td = document.createElement("td");
      td.textContent = data;
      tr.appendChild(td);
    });

    const td = document.createElement("td");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.bsToggle = "modal";
    btn.dataset.bsTarget = `#modal-${user.accountId}`;
    if (user.isApproved === true) {
      btn.className = "btn btn-dark-subtle my-auto";
      btn.textContent = "Approved";
      btn.disabled = true;
    } else if (user.isRejected === true) {
      btn.className = "btn btn-dark-subtle my-auto";
      btn.textContent = "Rejected";
      btn.disabled = true;
    } else {
      btn.className = "btn btn-dark my-auto";
      btn.textContent = "Details";
    }
    td.appendChild(btn);
    tr.appendChild(td);

    tbody.appendChild(tr);

    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = `modal-${user.accountId}`;
    modal.tabIndex = "-1";
    modal.ariaLabelledby = `modal-${user.accountId}-label`;
    modal.ariaHidden = "true";
    const rightSideDiv = document.querySelector(".right-side");
    rightSideDiv.appendChild(modal);

    const modalDialog = document.createElement("div");
    modalDialog.className = "modal-dialog";
    modal.appendChild(modalDialog);

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    modalDialog.appendChild(modalContent);

    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";
    modalContent.appendChild(modalHeader);

    const modalTitle = document.createElement("h5");
    modalTitle.className = "modal-title";
    modalTitle.id = `modal-${user.accountId}-label`;
    modalTitle.textContent = `User -  ${user.accountId}`;
    modalHeader.appendChild(modalTitle);

    const modalBody = document.createElement("div");
    modalBody.className = "modal-body";
    modalContent.appendChild(modalBody);

    const p2 = document.createElement("p");
    p2.textContent = `Account Type: ${user.accountType}`;
    modalBody.appendChild(p2);

    const p12 = document.createElement("p");
    p12.textContent = `Description: ${user.description}`;
    modalBody.appendChild(p12);

    const p3 = document.createElement("p");
    p3.textContent = `Applied Date: ${new Date(
      user.requestDate
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`;
    modalBody.appendChild(p3);

    const modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer";
    modalContent.appendChild(modalFooter);

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "btn btn-secondary";
    closeButton.dataset.bsDismiss = "modal";
    closeButton.textContent = "Close";

    const loanRepayments = document.createElement("button");
    loanRepayments.type = "button";
    loanRepayments.className = "btn btn-dark";
    loanRepayments.textContent = "Approve";
    modalFooter.appendChild(loanRepayments);

    const loanRepayment = document.createElement("button");
    loanRepayment.type = "button";
    loanRepayment.className = "btn btn-dark";
    loanRepayment.textContent = "Reject";
    modalFooter.appendChild(loanRepayment);

    loanRepayments.addEventListener("click", async () => {
      loanRepayment.disabled = true;
      loanRepayments.disabled = true;
      const repaymentsResponse = await axios.post(
        `${config.API_URL}/Admin/request/approve/close-account/${user.id}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (repaymentsResponse.status === 200) {
        loanRepayments.textContent = "Approved..";
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    });

    loanRepayment.addEventListener("click", async () => {
      loanRepayment.disabled = true;
      loanRepayments.disabled = true;
      const repaymentsResponse = await axios.post(
        `${config.API_URL}/Admin/request/reject/close-account/${user.id}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (repaymentsResponse.status === 200) {
        loanRepayment.textContent = "Rejected..";
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    });

    modalFooter.appendChild(closeButton);
  });
}

transactionsDiv.addEventListener("click", async () => {
  let elements = document.querySelectorAll(
    "#users, #accounts, #transactions, #loans, #all-accounts"
  );
  elements.forEach((element) => {
    element.classList.add("border-dark-subtle");
  });
  transactionsDiv.classList.remove("border-dark-subtle");
  transactionsDiv.classList.add("border-dark");
  const skeletonContainer = document.querySelector(".skeleton-container");
  skeletonContainer.classList.contains("d-none")
    ? skeletonContainer.classList.remove("d-none")
    : skeletonContainer.classList.add("d-none");
  await axios
    .post(
      `${config.API_URL}/Admin/transaction/request/all`,
      {},
      {
        withCredentials: true,
      }
    )
    .then((res) => {
      let rejectedUsers = res.data.filter((user) => user.isRejected);
      let approvedUsers = res.data.filter((user) => user.isApproved);
      let pendingUsers = res.data.filter(
        (user) => !user.isRejected && !user.isApproved
      );
      pendingUsers.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      let sortedData = [...pendingUsers, ...rejectedUsers, , ...approvedUsers];
      res.data = sortedData;
      if (usermode !== null) {
        res.data = res.data.filter(
          (item) =>
            usermodeAccounts.includes(item.accountId) ||
            usermodeAccounts.includes(item.receiverId)
        );
      }
      if (res.data.length === 0) {
        const rightSideDiv = document.querySelector(".right-side");
        rightSideDiv.innerHTML = "";
        const noTransactionsDiv = document.createElement("div");
        noTransactionsDiv.className = "no-transactions";
        const noTransactionsP = document.createElement("p");
        noTransactionsP.textContent = "No Transactions found for this user.";
        noTransactionsDiv.appendChild(noTransactionsP);
        rightSideDiv.appendChild(noTransactionsDiv);
        rightSideDiv.appendChild(skeletonContainer);
        skeletonContainer.classList.add("d-none");
        return;
      }
      // Select the right-side div
      const rightSideDiv = document.querySelector(".right-side");

      // Clear the right-side div
      rightSideDiv.innerHTML = "";

      // Create a table to display the loan details
      const table = document.createElement("table");
      table.className = "table ";

      const inputGroupDiv = document.createElement("div");
      inputGroupDiv.className = "input-group mb-3 px-3 pt-3";
      inputGroupDiv.innerHTML = `
        <input type="text" class="table-search form-control bg-transparent border border-dark-subtle" placeholder="Search" aria-label="Recipient's username" aria-describedby="button-addon2">
        <button class="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>
      `;
      rightSideDiv.appendChild(inputGroupDiv);
      document.querySelector(".table-search").addEventListener("input", (e) => {
        if (e.target.value.length > 2) {
          const searchValue = e.target.value.toLowerCase();
          const filteredData = res.data.filter((user) =>
            Object.values(user).some((value) => {
              if (
                typeof value === "string" &&
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+$/.test(value)
              ) {
                value = new Date(value).toLocaleString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                });
              }
              return (
                value !== null &&
                value.toString().toLowerCase().includes(searchValue)
              );
            })
          );
          renderTransactionTableBody(filteredData, tbody);
        } else {
          renderTransactionTableBody(res.data, tbody);
        }
      });
      // Create the table header
      const thead = document.createElement("thead");
      const tr = document.createElement("tr");
      let headers = ["ID↑↓", "Amount↑↓", "Transaction Type↑↓", "Details↑↓"];
      let sortDirections = {
        "ID↑↓": false,
        "Amount↑↓": false,
        "Transaction Type↑↓": false,
      };

      let mapdata = {
        "ID↑↓": "id",
        "Amount↑↓": "amount",
        "Transaction Type↑↓": "transactionType",
      };
      headers.forEach((header) => {
        const th = document.createElement("th");
        th.scope = "col";
        th.textContent = `${header}`;
        tr.appendChild(th);
        th.style.cursor = "pointer";
        if (header !== "Details") {
          th.addEventListener("click", () => {
            sortDirections[header] = !sortDirections[header];
            res.data.sort((a, b) => {
              if (typeof a[mapdata[header]] === "string") {
                return sortDirections[header]
                  ? a[mapdata[header]].localeCompare(b[mapdata[header]])
                  : b[mapdata[header]].localeCompare(a[mapdata[header]]);
              } else {
                return sortDirections[header]
                  ? new Date(a[mapdata[header]]) - new Date(b[mapdata[header]])
                  : new Date(b[mapdata[header]]) - new Date(a[mapdata[header]]);
              }
            });
            renderTransactionTableBody(res.data, tbody);
          });
        }
      });

      thead.appendChild(tr);
      table.appendChild(thead);

      // Create the table body
      const tbody = document.createElement("tbody");
      renderTransactionTableBody(res.data, tbody);
      table.appendChild(tbody);
      rightSideDiv.appendChild(table);
      rightSideDiv.appendChild(skeletonContainer);
      skeletonContainer.classList.add("d-none");
    })
    .catch((err) => {
      // console.log(err);
    });
});

function renderTransactionTableBody(trasactionData, tbody) {
  tbody.innerHTML = "";

  trasactionData.forEach((user) => {
    // console.log(user);
    const tr = document.createElement("tr");
    [user.id, user.amount, user.transactionType].forEach((data) => {
      const td = document.createElement("td");
      td.textContent = data;
      tr.appendChild(td);
    });

    const td = document.createElement("td");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.bsToggle = "modal";
    btn.dataset.bsTarget = `#modal-${user.id}`;
    if (user.isApproved === true) {
      btn.className = "btn btn-dark-subtle my-auto";
      btn.textContent = "Approved";
      btn.disabled = true;
    } else if (user.isRejected === true) {
      btn.className = "btn btn-dark-subtle my-auto";
      btn.textContent = "Rejected";
      btn.disabled = true;
    } else {
      btn.className = "btn btn-dark my-auto";
      btn.textContent = "Details";
    }
    td.appendChild(btn);
    tr.appendChild(td);

    tbody.appendChild(tr);

    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = `modal-${user.id}`;
    modal.tabIndex = "-1";
    modal.ariaLabelledby = `modal-${user.id}-label`;
    modal.ariaHidden = "true";
    const rightSideDiv = document.querySelector(".right-side");
    rightSideDiv.appendChild(modal);

    const modalDialog = document.createElement("div");
    modalDialog.className = "modal-dialog";
    modal.appendChild(modalDialog);

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    modalDialog.appendChild(modalContent);

    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";
    modalContent.appendChild(modalHeader);

    const modalTitle = document.createElement("h5");
    modalTitle.className = "modal-title";
    modalTitle.id = `modal-${user.id}-label`;
    modalTitle.textContent = `User -  ${user.id}`;
    modalHeader.appendChild(modalTitle);

    const modalBody = document.createElement("div");
    modalBody.className = "modal-body";
    modalContent.appendChild(modalBody);

    const p2 = document.createElement("p");
    p2.textContent = `Account ID: ${user.accountId}`;
    modalBody.appendChild(p2);

    const p22 = document.createElement("p");
    p22.textContent = `Receiver ID: ${user.receiverId}`;
    modalBody.appendChild(p22);

    const p12 = document.createElement("p");
    p12.textContent = `Amount : ${user.amount}`;
    modalBody.appendChild(p12);

    const p122 = document.createElement("p");
    p122.textContent = `Amount : ${user.transactionType}`;
    modalBody.appendChild(p122);

    const p3 = document.createElement("p");
    p3.textContent = `Applied Date: ${new Date(
      user.timestamp
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })}`;
    modalBody.appendChild(p3);

    const modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer";
    modalContent.appendChild(modalFooter);

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "btn btn-secondary";
    closeButton.dataset.bsDismiss = "modal";
    closeButton.textContent = "Close";

    const loanRepayments = document.createElement("button");
    loanRepayments.type = "button";
    loanRepayments.className = "btn btn-dark";
    loanRepayments.textContent = "Approve";
    modalFooter.appendChild(loanRepayments);

    const loanRepayment = document.createElement("button");
    loanRepayment.type = "button";
    loanRepayment.className = "btn btn-dark";
    loanRepayment.textContent = "Reject";
    modalFooter.appendChild(loanRepayment);

    loanRepayments.addEventListener("click", async () => {
      loanRepayment.disabled = true;
      loanRepayments.disabled = true;
      const repaymentsResponse = await axios.post(
        `${config.API_URL}/Admin/Transaction/request/approve/${user.id}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (repaymentsResponse.status === 200) {
        loanRepayments.textContent = "Approved..";
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    });

    loanRepayment.addEventListener("click", async () => {
      loanRepayment.disabled = true;
      loanRepayments.disabled = true;
      const repaymentsResponse = await axios.post(
        `${config.API_URL}/Admin/Transaction/request/reject/${user.id}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (repaymentsResponse.status === 200) {
        loanRepayment.textContent = "Rejected..";
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    });

    modalFooter.appendChild(closeButton);
  });
}

loansDiv.addEventListener("click", async () => {
  let elements = document.querySelectorAll(
    "#users, #accounts, #transactions, #loans, #all-accounts"
  );
  elements.forEach((element) => {
    element.classList.add("border-dark-subtle");
  });
  loansDiv.classList.remove("border-dark-subtle");
  loansDiv.classList.add("border-dark");
  let skeletonContainer = document.querySelector(".skeleton-container");
  skeletonContainer.classList.contains("d-none")
    ? skeletonContainer.classList.remove("d-none")
    : skeletonContainer.classList.add("d-none");
  await axios
    .get(`${config.API_URL}/Admin/loans/request/pending`, {
      withCredentials: true,
    })
    .then((res) => {
      res.data.sort(
        (a, b) => new Date(a.appliedDate) - new Date(b.appliedDate)
      );
      console.log(res.data);
      if (usermode !== null) {
        res.data = res.data.filter((item) =>
          usermodeAccounts.includes(item.accountId)
        );
      }
      if (res.data.length === 0) {
        const rightSideDiv = document.querySelector(".right-side");
        rightSideDiv.innerHTML = "";
        const noTransactionsDiv = document.createElement("div");
        noTransactionsDiv.className = "no-transactions";
        const noTransactionsP = document.createElement("p");
        noTransactionsP.textContent = "No Loans found for this user.";
        noTransactionsDiv.appendChild(noTransactionsP);
        rightSideDiv.appendChild(noTransactionsDiv);
        rightSideDiv.appendChild(skeletonContainer);
        skeletonContainer.classList.add("d-none");
        return;
      }
      // Select the right-side div
      const rightSideDiv = document.querySelector(".right-side");

      // Clear the right-side div
      rightSideDiv.innerHTML = "";

      // Create a table to display the loan details
      const table = document.createElement("table");
      table.className = "table ";

      const inputGroupDiv = document.createElement("div");
      inputGroupDiv.className = "input-group mb-3 px-3 pt-3";
      inputGroupDiv.innerHTML = `
        <input type="text" class="table-search form-control bg-transparent border border-dark-subtle" placeholder="Search" aria-label="Recipient's username" aria-describedby="button-addon2">
        <button class="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>
      `;
      rightSideDiv.appendChild(inputGroupDiv);

      document.querySelector(".table-search").addEventListener("input", (e) => {
        if (e.target.value.length > 2) {
          const searchValue = e.target.value.toLowerCase();
          const filteredData = res.data.filter((user) =>
            Object.values(user).some((value) => {
              if (
                typeof value === "string" &&
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+$/.test(value)
              ) {
                value = new Date(value).toLocaleString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                });
              }
              return (
                value !== null &&
                value.toString().toLowerCase().includes(searchValue)
              );
            })
          );
          renderLoanTableBody(filteredData, tbody);
        } else {
          renderLoanTableBody(res.data, tbody);
        }
      });

      // Create the table header
      const thead = document.createElement("thead");
      const tr = document.createElement("tr");
      let headers = [
        "ID↑↓",
        "Amount↑↓",
        "Pending Amount↑↓",
        "Duration",
        "Details",
      ];
      let sortDirections = {
        "ID↑↓": false,
        "Amount↑↓": false,
        "Pending Amount↑↓": false,
        "Duration↑↓": false,
      };
      let mapdata = {
        "ID↑↓": "id",
        "Amount↑↓": "amount",
        "Pending Amount↑↓": "pendingAmount",
        "Duration↑↓": "appliedDate",
      };
      headers.forEach((header) => {
        const th = document.createElement("th");
        th.scope = "col";
        th.textContent = `${header}`;
        tr.appendChild(th);
        th.style.cursor = "pointer";
        if (header !== "Details") {
          th.addEventListener("click", () => {
            sortDirections[header] = !sortDirections[header];
            res.data.sort((a, b) => {
              if (typeof a[mapdata[header]] === "string") {
                return sortDirections[header]
                  ? a[mapdata[header]].localeCompare(b[mapdata[header]])
                  : b[mapdata[header]].localeCompare(a[mapdata[header]]);
              } else {
                return sortDirections[header]
                  ? new Date(a[mapdata[header]]) - new Date(b[mapdata[header]])
                  : new Date(b[mapdata[header]]) - new Date(a[mapdata[header]]);
              }
            });
            renderLoanTableBody(res.data, tbody);
          });
        }
      });

      thead.appendChild(tr);
      table.appendChild(thead);

      // Create the table body
      const tbody = document.createElement("tbody");
      renderLoanTableBody(res.data, tbody);
      table.appendChild(tbody);
      rightSideDiv.appendChild(table);
      rightSideDiv.appendChild(skeletonContainer);
      skeletonContainer.classList.add("d-none");
    })
    .catch((err) => {
      // console.log(err);
    });
});

function renderLoanTableBody(loanData, tbody) {
  tbody.innerHTML = "";

  loanData.forEach((user) => {
    const tr = document.createElement("tr");
    [user.id, user.amount, user.pendingAmount].forEach((data) => {
      const td = document.createElement("td");
      td.textContent = data;
      tr.appendChild(td);
    });
    let appliedDate = new Date(user.appliedDate);
    let targetDate = new Date(user.targetDate);
    let durationInMilliseconds = targetDate - appliedDate;
    let durationInDays = Math.ceil(
      durationInMilliseconds / (1000 * 60 * 60 * 24)
    );
    const td1 = document.createElement("td");
    td1.textContent = durationInDays + " days";
    tr.appendChild(td1);

    // console.log(durationInDays);

    const td = document.createElement("td");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.bsToggle = "modal";
    btn.dataset.bsTarget = `#modal-${user.id}`;
    btn.className = "btn btn-dark my-auto";
    btn.textContent = "Details";
    td.appendChild(btn);
    tr.appendChild(td);

    tbody.appendChild(tr);

    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = `modal-${user.id}`;
    modal.tabIndex = "-1";
    modal.ariaLabelledby = `modal-${user.id}-label`;
    modal.ariaHidden = "true";
    const rightSideDiv = document.querySelector(".right-side");
    rightSideDiv.appendChild(modal);

    const modalDialog = document.createElement("div");
    modalDialog.className = "modal-dialog";
    modal.appendChild(modalDialog);

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    modalDialog.appendChild(modalContent);

    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";
    modalContent.appendChild(modalHeader);

    const modalTitle = document.createElement("h5");
    modalTitle.className = "modal-title";
    modalTitle.id = `modal-${user.id}-label`;
    modalTitle.textContent = `User -  ${user.id}`;
    modalHeader.appendChild(modalTitle);

    const modalBody = document.createElement("div");
    modalBody.className = "modal-body";
    modalContent.appendChild(modalBody);

    const p2 = document.createElement("p");
    p2.textContent = `Account ID: ${user.id}`;
    modalBody.appendChild(p2);

    const p22 = document.createElement("p");
    p22.textContent = `Amount: ${user.amount}`;
    modalBody.appendChild(p22);

    const p12 = document.createElement("p");
    p12.textContent = `Pending Amount : ${user.pendingAmount}`;
    modalBody.appendChild(p12);

    const p122 = document.createElement("p");
    p122.textContent = `Duration : ${durationInDays}`;
    modalBody.appendChild(p122);

    const p3 = document.createElement("p");
    p3.textContent = `Duration: ${new Date(user.appliedDate).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
      }
    )} - ${new Date(user.targetDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })}`;
    modalBody.appendChild(p3);

    const modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer";
    modalContent.appendChild(modalFooter);

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "btn btn-secondary";
    closeButton.dataset.bsDismiss = "modal";
    closeButton.textContent = "Close";

    const loanRepayments = document.createElement("button");
    loanRepayments.type = "button";
    loanRepayments.className = "btn btn-dark";
    loanRepayments.textContent = "Approve";
    modalFooter.appendChild(loanRepayments);

    const loanRepayment = document.createElement("button");
    loanRepayment.type = "button";
    loanRepayment.className = "btn btn-dark";
    loanRepayment.textContent = "Reject";
    modalFooter.appendChild(loanRepayment);

    loanRepayments.addEventListener("click", async () => {
      loanRepayment.disabled = true;
      loanRepayments.disabled = true;
      const repaymentsResponse = await axios.post(
        `${config.API_URL}/Admin/loans/request/approve/${user.id}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (repaymentsResponse.status === 200) {
        loanRepayments.textContent = "Approved..";
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    });

    loanRepayment.addEventListener("click", async () => {
      loanRepayment.disabled = true;
      loanRepayments.disabled = true;
      const repaymentsResponse = await axios.post(
        `${config.API_URL}/Admin/loans/request/reject/${user.id}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (repaymentsResponse.status === 200) {
        loanRepayment.textContent = "Rejected..";
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    });

    modalFooter.appendChild(closeButton);
  });
}

function closeUserMode() {
  localStorage.removeItem("usermode-user");
  var toastLiveExample = document.getElementById("liveToast");
  var toastHeaderStrong = toastLiveExample.querySelector(
    ".toast-header strong"
  );
  var toastBody = toastLiveExample.querySelector(".toast-body");

  // Edit the toast content
  toastHeaderStrong.innerText = "UserMode Deactivated!";
  toastBody.innerText = `Redirecting....`;

  // Show the toast
  var toast = new bootstrap.Toast(toastLiveExample);
  toast.show();
  setTimeout(() => {
    window.location.reload();
  }, 3000);
}
