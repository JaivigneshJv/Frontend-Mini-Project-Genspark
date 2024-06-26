// Event listener for the transactions card click
const transactionsDiv = document.getElementById("transactions");
transactionsDiv.addEventListener("click", async () => {
  setTransactionDivActive();
  const skeletonContainer = document.querySelector(".skeleton-container");
  skeletonContainer.classList.contains("d-none")
    ? skeletonContainer.classList.remove("d-none")
    : skeletonContainer.classList.add("d-none");
  fetchAccountDivData(skeletonContainer);
});

//Helper Functions
function setTransactionDivActive() {
  let elements = document.querySelectorAll(
    "#users, #accounts, #transactions, #loans, #all-accounts"
  );
  elements.forEach((element) => {
    element.classList.add("border-dark-subtle");
  });
  transactionsDiv.classList.remove("border-dark-subtle");
  transactionsDiv.classList.add("border-dark");
}
async function fetchAccountDivData(skeletonContainer) {
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
      //
    });
}
function renderTransactionTableBody(trasactionData, tbody) {
  tbody.innerHTML = "";

  trasactionData.forEach((user) => {
    //
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
