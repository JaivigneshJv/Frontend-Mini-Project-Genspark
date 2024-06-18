async function loadAccounts() {
  try {
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

      // Inside the forEach loop where you create the account cards
      accountDiv.addEventListener("click", async () => {
        // Fetch the transactions
        const transactionsResponse = await axios.get(
          `${config.API_URL}/Transaction/get-transactions/${account.id}`,
          {
            withCredentials: true,
          }
        );
        const transactionData = transactionsResponse.data.sort((a, b) => {
          return new Date(b.timestamp) - new Date(a.timestamp);
        });

        // Select the right-side div
        const rightSideDiv = document.querySelector(".right-side");

        // Clear the right-side div
        rightSideDiv.innerHTML = "";

        const div = document.createElement("div");
        div.className = "table-responsive";
        // Create a table
        const table = document.createElement("table");
        table.className = "table ";

        // Create the table header
        const thead = document.createElement("thead");
        const tr = document.createElement("tr");
        ["Receiver ID", "Amount", "Type", "Timestamp"].forEach((header) => {
          const th = document.createElement("th");
          th.scope = "col";
          th.textContent = header;
          tr.appendChild(th);
        });
        thead.appendChild(tr);
        table.appendChild(thead);

        // Create the table body
        const tbody = document.createElement("tbody");
        console.log(transactionsResponse.data);
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
        table.appendChild(tbody);
        div.appendChild(table);
        // Append the table to the right-side div
        rightSideDiv.appendChild(table);
      });
    });
  } catch (error) {
    console.log(error);
  }
}
loadAccounts();
