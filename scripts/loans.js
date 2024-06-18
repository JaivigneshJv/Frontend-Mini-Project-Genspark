// Function to load accounts
async function loadAccounts() {
  try {
    // Fetch all accounts from the API
    const response = await axios.get(
      `${config.API_URL}/Accounts/get-all-accounts`,
      {
        withCredentials: true,
      }
    );
    console.log(response.data);

    // Select the container where the accounts will be appended
    const accountsContainer = document.querySelector(".left-side-accounts");

    // Select the skeleton container and hide it
    const skeletonContainer = document.querySelector(".skeleton-container");
    skeletonContainer.className = skeletonContainer.className + " d-none";

    // Loop through the array of accounts
    response.data.forEach((account) => {
      // Create a new div for the account
      const accountDiv = document.createElement("div");
      accountDiv.className = "card-account";

      const innerDiv = document.createElement("div");

      // Create a div for the account title
      const titleDiv = document.createElement("div");
      titleDiv.className = "card-account-title";
      const titleP = document.createElement("p");
      titleP.textContent = account.accountType + " Account";
      titleDiv.appendChild(titleP);
      innerDiv.appendChild(titleDiv);

      // Create a div for the account details
      const detailsDiv = document.createElement("div");
      detailsDiv.className = "card-account-details";
      const detailsP1 = document.createElement("p");
      detailsP1.textContent =
        "**** - **** - **** - **** - " + account.id.slice(-4); // Last 4 characters of the id
      const detailsP2 = document.createElement("p");
      detailsP2.textContent = "Balance: $" + account.balance;
      detailsDiv.appendChild(detailsP1);
      detailsDiv.appendChild(detailsP2);
      innerDiv.appendChild(detailsDiv);

      // Create the arrow div
      const arrowDiv = document.createElement("div");
      arrowDiv.className = "arrow my-auto mx-3";
      const arrowImg = document.createElement("img");
      arrowImg.src =
        "../../node_modules/bootstrap-icons/icons/chevron-right.svg";
      arrowImg.alt = "";
      arrowImg.style.width = "2vw";
      arrowDiv.appendChild(arrowImg);

      // Append the inner div and arrow div to the account div
      accountDiv.appendChild(innerDiv);
      accountDiv.appendChild(arrowDiv);

      // Append the account div to the accounts container
      accountsContainer.appendChild(accountDiv);

      // Add click event listener to each account div
      accountDiv.addEventListener("click", async () => {
        // Fetch the loans for the selected account
        const loanResponses = await axios.get(
          `${config.API_URL}/Loan/get-all-account-loans/${account.id}`,
          {
            withCredentials: true,
          }
        );

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
        ["ID", "Amount", "Pending Amount", "Applied Date", "Details"].forEach(
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
        loanResponses.data.forEach((loan) => {
          const tr = document.createElement("tr");
          [
            loan.id,
            loan.amount,
            loan.pendingAmount,
            new Date(loan.appliedDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          ].forEach((data) => {
            const td = document.createElement("td");
            td.textContent = data;
            tr.appendChild(td);
          });

          // Create a button for the loan
          const td = document.createElement("td");
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "btn btn-secondary my-auto";
          btn.dataset.bsToggle = "modal";
          btn.dataset.bsTarget = `#modal-${loan.id}`;
          btn.textContent = "Details";
          td.appendChild(btn);
          tr.appendChild(td);

          tbody.appendChild(tr);

          // Create a modal for the loan
          const modal = document.createElement("div");
          modal.className = "modal fade";
          modal.id = `modal-${loan.id}`;
          modal.tabIndex = "-1";
          modal.ariaLabelledby = `modal-${loan.id}-label`;
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
          modalTitle.id = `modal-${loan.id}-label`;
          modalTitle.textContent = `Loan ${loan.id}`;
          modalHeader.appendChild(modalTitle);

          const modalBody = document.createElement("div");
          modalBody.className = "modal-body";
          modalContent.appendChild(modalBody);

          const p1 = document.createElement("p");
          p1.textContent = `Amount: ${loan.amount}`;
          modalBody.appendChild(p1);

          const p2 = document.createElement("p");
          p2.textContent = `Pending Amount: ${loan.pendingAmount}`;
          modalBody.appendChild(p2);

          const p3 = document.createElement("p");
          p3.textContent = `Applied Date: ${new Date(
            loan.appliedDate
          ).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`;
          modalBody.appendChild(p3);

          if (loan.status === "Closed") {
            const p6 = document.createElement("p");
            p6.textContent = `Target Date: ${new Date(
              loan.repaidDate
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}`;
            modalBody.appendChild(p6);
          } else {
            const p5 = document.createElement("p");
            p5.textContent = `Target Date: ${new Date(
              loan.targetDate
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}`;
            modalBody.appendChild(p5);
          }
          const p4 = document.createElement("p");
          p4.textContent = `Status: ${loan.status}`;
          modalBody.appendChild(p4);

          const loanRepayments = document.createElement("button");
          loanRepayments.type = "button";
          loanRepayments.className = "btn btn-secondary";
          loanRepayments.textContent = "Loan Repayments";
          modalBody.appendChild(loanRepayments);
          loanRepayments.addEventListener("click", async () => {
            loanRepayments.disabled = true;
            const repaymentsResponse = await axios.post(
              `${config.API_URL}/Loan/loan-repayments/${loan.id}`,
              {},
              {
                withCredentials: true,
              }
            );
            const repayments = repaymentsResponse.data;
            if (repayments.length === 0) {
              const div = document.createElement("div");
              div.className =
                "d-flex p-4 justify-content-between overflow-auto";
              div.style.height = "2vh;";
              const p = document.createElement("p");
              p.textContent = "No repayments made yet";
              div.appendChild(p);
              modalBody.appendChild(div);
            }
            repayments.forEach((repayment) => {
              const div = document.createElement("div");
              div.className =
                "d-flex p-4 justify-content-between overflow-auto";
              div.style.height = "2vh;";
              const p = document.createElement("p");
              p.textContent = `Amount: ${repayment.amount}`;
              const p2 = document.createElement("p");
              p2.textContent = `Date: ${new Date(
                repayment.paymentDate
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}`;
              div.appendChild(p);
              div.appendChild(p2);
              modalBody.appendChild(div);
            });
          });
          const modalFooter = document.createElement("div");
          modalFooter.className = "modal-footer";
          modalContent.appendChild(modalFooter);

          const closeButton = document.createElement("button");
          closeButton.type = "button";
          closeButton.className = "btn btn-secondary";
          closeButton.dataset.bsDismiss = "modal";
          closeButton.textContent = "Close";

          axios
            .post(
              `${config.API_URL}/Loan/get-loan-details`,
              {
                amount: loan.amount,
                appliedDate: loan.appliedDate,
                targetDate: loan.targetDate,
              },
              {
                withCredentials: true,
              }
            )
            .then((response) => {
              const p7 = document.createElement("p");
              p7.textContent = `Interest: ${response.data.interestRate}%`;
              modalFooter.appendChild(p7);
              const p8 = document.createElement("p");
              p8.textContent = `Total Amount: ${response.data.finalAmount}`;
              modalFooter.appendChild(p8);
              if (loan.status === "Opened") {
                const payButton = document.createElement("button");
                payButton.type = "button";
                payButton.className = "btn btn-dark";
                payButton.textContent = "Pay Loan";
                modalFooter.appendChild(payButton);
              }
              modalFooter.appendChild(closeButton);
            });
        });
        table.appendChild(tbody);

        // Append the table to the right-side div
        rightSideDiv.appendChild(table);
      });
    });
  } catch (error) {
    console.log(error);
  }
}

// Call the loadAccounts function to start loading the accounts
loadAccounts();
