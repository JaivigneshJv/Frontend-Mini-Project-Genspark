const userDiv = document.getElementById("users");
const accountDiv = document.getElementById("accounts");
const transactionsDiv = document.getElementById("transactions");
const loansDiv = document.getElementById("loans");

// Event listener for the user card click
userDiv.addEventListener("click", async () => {
  let elements = document.querySelectorAll(
    "#users, #accounts, #transactions, #loans"
  );
  elements.forEach((element) => {
    element.classList.add("border-dark-subtle");
  });
  userDiv.classList.remove("border-dark-subtle");
  userDiv.classList.add("border-dark");
  await axios
    .get(`${config.API_URL}/Admin/get-all-user`, {
      withCredentials: true,
    })
    .then((res) => {
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
      // console.log(res.data);
      // Select the right-side div
      const rightSideDiv = document.querySelector(".right-side");

      // Clear the right-side div
      rightSideDiv.innerHTML = "";

      // Create a table to display the loan details
      const table = document.createElement("table");
      table.className = "table ";

      // Create the table header
      const thead = document.createElement("thead");
      const tr = document.createElement("tr");
      ["ID", "First Name", "Contact", "CreatedDate", "Details"].forEach(
        (header) => {
          const th = document.createElement("th");
          th.scope = "col";
          th.textContent = header;
          tr.appendChild(th);
        }
      );
      thead.appendChild(tr);
      table.appendChild(thead);

      // Create the table body
      const tbody = document.createElement("tbody");
      res.data.forEach((user) => {
        // console.log(user);
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
        if (user.isActive === false) {
          btn.className = "btn btn-dark my-auto";
        } else {
          btn.className = "btn btn-secondary my-auto";
        }
        btn.dataset.bsToggle = "modal";
        btn.dataset.bsTarget = `#modal-${user.id}`;
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

        if (user.isActive === false) {
          const loanRepayments = document.createElement("button");
          loanRepayments.type = "button";
          loanRepayments.className = "btn btn-dark";
          loanRepayments.textContent = "Activate";
          modalFooter.appendChild(loanRepayments);

          loanRepayments.addEventListener("click", async () => {
            loanRepayments.disabled = true;
            const repaymentsResponse = await axios.get(
              `${config.ADMIN_URL}/activate/${user.id}`,
              {
                withCredentials: true,
              }
            );
            if (repaymentsResponse.status === 200) {
              loanRepayments.textContent = "Activated..";
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            }
          });
        }
        modalFooter.appendChild(closeButton);
      });

      table.appendChild(tbody);
      rightSideDiv.appendChild(table);
    })
    .catch((err) => {
      console.log(err);
    });
});

accountDiv.addEventListener("click", async () => {
  let elements = document.querySelectorAll(
    "#users, #accounts, #transactions, #loans"
  );
  elements.forEach((element) => {
    element.classList.add("border-dark-subtle");
  });
  accountDiv.classList.remove("border-dark-subtle");
  accountDiv.classList.add("border-dark");

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
      // console.log(res.data);
      // Select the right-side div
      const rightSideDiv = document.querySelector(".right-side");

      // Clear the right-side div
      rightSideDiv.innerHTML = "";

      // Create a table to display the loan details
      const table = document.createElement("table");
      table.className = "table ";

      // Create the table header
      const thead = document.createElement("thead");
      const tr = document.createElement("tr");
      ["ID", "Account Type", "Description", "Details"].forEach((header) => {
        const th = document.createElement("th");
        th.scope = "col";
        th.textContent = header;
        tr.appendChild(th);
      });
      thead.appendChild(tr);
      table.appendChild(thead);

      // Create the table body
      const tbody = document.createElement("tbody");
      res.data.forEach((user) => {
        // console.log(user);
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

      table.appendChild(tbody);
      rightSideDiv.appendChild(table);
    })
    .catch((err) => {
      // console.log(err);
    });
});

transactionsDiv.addEventListener("click", async () => {
  let elements = document.querySelectorAll(
    "#users, #accounts, #transactions, #loans"
  );
  elements.forEach((element) => {
    element.classList.add("border-dark-subtle");
  });
  transactionsDiv.classList.remove("border-dark-subtle");
  transactionsDiv.classList.add("border-dark");
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
      // console.log(res.data);
      // Select the right-side div
      const rightSideDiv = document.querySelector(".right-side");

      // Clear the right-side div
      rightSideDiv.innerHTML = "";

      // Create a table to display the loan details
      const table = document.createElement("table");
      table.className = "table ";

      // Create the table header
      const thead = document.createElement("thead");
      const tr = document.createElement("tr");
      ["ID", "Amount", "transaction Type", "Details"].forEach((header) => {
        const th = document.createElement("th");
        th.scope = "col";
        th.textContent = header;
        tr.appendChild(th);
      });
      thead.appendChild(tr);
      table.appendChild(thead);

      // Create the table body
      const tbody = document.createElement("tbody");
      res.data.forEach((user) => {
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

      table.appendChild(tbody);
      rightSideDiv.appendChild(table);
    })
    .catch((err) => {
      // console.log(err);
    });
});

loansDiv.addEventListener("click", async () => {
  let elements = document.querySelectorAll(
    "#users, #accounts, #transactions, #loans"
  );
  elements.forEach((element) => {
    element.classList.add("border-dark-subtle");
  });
  loansDiv.classList.remove("border-dark-subtle");
  loansDiv.classList.add("border-dark");

  await axios
    .get(`${config.API_URL}/Admin/loans/request/pending`, {
      withCredentials: true,
    })
    .then((res) => {
      res.data.sort(
        (a, b) => new Date(a.appliedDate) - new Date(b.appliedDate)
      );
      // console.log(res.data);
      // Select the right-side div
      const rightSideDiv = document.querySelector(".right-side");

      // Clear the right-side div
      rightSideDiv.innerHTML = "";

      // Create a table to display the loan details
      const table = document.createElement("table");
      table.className = "table ";

      // Create the table header
      const thead = document.createElement("thead");
      const tr = document.createElement("tr");
      ["ID", "Amount", "Pending Amount", "Duration", "Details"].forEach(
        (header) => {
          const th = document.createElement("th");
          th.scope = "col";
          th.textContent = header;
          tr.appendChild(th);
        }
      );
      thead.appendChild(tr);
      table.appendChild(thead);

      // Create the table body
      const tbody = document.createElement("tbody");
      res.data.forEach((user) => {
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
        btn.dataset.bsTarget = `#modal-${user.accountId}`;
        btn.className = "btn btn-dark my-auto";
        btn.textContent = "Details";
        td.appendChild(btn);
        tr.appendChild(td);

        tbody.appendChild(tr);

        const modal = document.createElement("div");
        modal.className = "modal fade";
        modal.id = `modal-${user.accountId}`;
        modal.tabIndex = "-1";
        modal.ariaLabelledby = `modal-${user.accountId}-label`;
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
        modalTitle.id = `modal-${user.accountId}-label`;
        modalTitle.textContent = `User -  ${user.id}`;
        modalHeader.appendChild(modalTitle);

        const modalBody = document.createElement("div");
        modalBody.className = "modal-body";
        modalContent.appendChild(modalBody);

        const p2 = document.createElement("p");
        p2.textContent = `Account ID: ${user.accountId}`;
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
        p3.textContent = `Duration: ${new Date(
          user.appliedDate
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })} - ${new Date(user.targetDate).toLocaleDateString("en-US", {
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

      table.appendChild(tbody);
      rightSideDiv.appendChild(table);
    })
    .catch((err) => {
      // console.log(err);
    });
});
