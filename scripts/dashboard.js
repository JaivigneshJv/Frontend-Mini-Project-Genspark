const sortDirections = {
  "Receiver ID": false,
  Amount: false,
  Type: false,
  Timestamp: false,
};

async function loadAccounts() {
  try {
    const response = await axios.get(
      `${config.API_URL}/Accounts/get-all-accounts`,
      {
        withCredentials: true,
      }
    );
    console.log(response.data);

    if (response.data.length === 0) {
      const accountsContainer = document.querySelector(".left-side-accounts");
      const noAccountsDiv = document.createElement("div");
      noAccountsDiv.className = "no-accounts";
      const noAccountsP = document.createElement("p");
      noAccountsP.textContent = "No accounts found. Create One!";
      noAccountsDiv.appendChild(noAccountsP);
      accountsContainer.appendChild(noAccountsDiv);
      return;
    }

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

      // Inside the forEach loop where you create the account cards
      accountDiv.addEventListener("click", async () => {
        // Fetch the transactions
        const transactionsResponse = await axios.get(
          `${config.API_URL}/Transaction/get-transactions/${account.id}`,
          {
            withCredentials: true,
          }
        );
        console.log(transactionsResponse.data);
        if (transactionsResponse.data.length === 0) {
          const rightSideDiv = document.querySelector(".right-side");
          rightSideDiv.innerHTML = "";
          const noTransactionsDiv = document.createElement("div");
          noTransactionsDiv.className = "no-transactions";
          const noTransactionsP = document.createElement("p");
          noTransactionsP.textContent =
            "No transactions found for this account.";
          noTransactionsDiv.appendChild(noTransactionsP);
          rightSideDiv.appendChild(noTransactionsDiv);
          return;
        }
        const transactionData = transactionsResponse.data.sort((a, b) => {
          return new Date(b.timestamp) - new Date(a.timestamp);
        });

        // Select the right-side div
        const rightSideDiv = document.querySelector(".right-side");

        // Clear the right-side div
        rightSideDiv.innerHTML = "";
        const inputGroupDiv = document.createElement("div");
        inputGroupDiv.className = "input-group mb-3 px-3 pt-3";
        inputGroupDiv.innerHTML = `
          <input type="text" class="table-search form-control bg-transparent border border-dark-subtle" placeholder="" aria-label="Recipient's username" aria-describedby="button-addon2">
          <button class="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>
        `;
        rightSideDiv.appendChild(inputGroupDiv);
        document
          .querySelector(".table-search")
          .addEventListener("input", (e) => {
            if (e.target.value.length > 2) {
              const searchValue = e.target.value.toLowerCase();
              console.log(searchValue);

              const filteredData = transactionData.filter((transaction) =>
                Object.values(transaction).some((value) => {
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
              // Re-render the table body with the filtered data
              renderTableBody(filteredData, tbody);
            } else {
              // If the search value is too short, re-render the table body with all data
              renderTableBody(transactionData, tbody);
            }
          });

        const div = document.createElement("div");
        div.className = "table-responsive";
        // Create a table
        const table = document.createElement("table");
        table.className = "table ";

        // Create the table header
        const thead = document.createElement("thead");
        const tr = document.createElement("tr");
        ["Receiver ID↑↓", "Amount↑↓", "Type↑↓", "Timestamp↑↓"].forEach(
          (header) => {
            const th = document.createElement("th");
            th.scope = "col";
            th.textContent = header;
            tr.appendChild(th);
            th.style.cursor = "pointer";
            let mapdata = {
              "Receiver ID↑↓": "receiverId",
              "Amount↑↓": "amount",
              "Type↑↓": "transactionType",
              "Timestamp↑↓": "timestamp",
            };
            th.addEventListener("click", () => {
              // Reverse the sort direction for this column
              sortDirections[header] = !sortDirections[header];

              transactionData.sort((a, b) => {
                if (typeof a[mapdata[header]] === "string") {
                  return sortDirections[header]
                    ? a[mapdata[header]].localeCompare(b[mapdata[header]])
                    : b[mapdata[header]].localeCompare(a[mapdata[header]]);
                } else {
                  return sortDirections[header]
                    ? a[mapdata[header]] - b[mapdata[header]]
                    : b[mapdata[header]] - a[mapdata[header]];
                }
              });

              renderTableBody(transactionData, tbody);
            });
          }
        );
        thead.appendChild(tr);
        table.appendChild(thead);

        // Create the table body
        const tbody = document.createElement("tbody");
        renderTableBody(transactionData, tbody);
        table.appendChild(tbody);
        div.appendChild(table);

        // Create the "Download PDF" button
        const downloadButton = document.createElement("button");
        downloadButton.textContent = "Download PDF";
        downloadButton.className = "btn btn-dark m-3";
        downloadButton.addEventListener("click", () => downloadPDF(table));

        // Append the button and table to the right-side div
        rightSideDiv.appendChild(div);
        rightSideDiv.appendChild(downloadButton);
      });
    });
  } catch (error) {
    console.log(error);
  }
}
loadAccounts();

function renderTableBody(transactionData, tbody) {
  // Clear the table body
  tbody.innerHTML = "";

  // Add the new rows to the table body
  transactionData.forEach((transaction) => {
    const tr = document.createElement("tr");
    [
      transaction.receiverId,
      transaction.amount,
      transaction.transactionType,
      new Date(transaction.timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    ].forEach((data) => {
      const td = document.createElement("td");
      td.textContent = data;
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

function downloadPDF(table) {
  const {jsPDF} = window.jspdf;
  const doc = new jsPDF();
  doc.autoTable({html: table});
  const text = document.querySelector(".table-search").value;
  const filename = text
    ? `${text} - simplebank - transactions.pdf`
    : "simplebank - transactions.pdf";
  doc.save(filename);
}
