// Event listener for the user card click
const userDiv = document.getElementById("users");
userDiv.addEventListener("click", async () => {
    setUserDivActive();
    const skeletonContainer = document.querySelector(".skeleton-container");
    // Toggle the visibility of the skeleton container
    skeletonContainer.classList.toggle("d-none");
    fetchUserDivData(skeletonContainer);
});

// Helper Functions

// Fetch user data for the user div
async function fetchUserDivData(skeletonContainer) {
    try {
        const res = await axios.get(`${config.API_URL}/Admin/get-all-user`, {
            withCredentials: true,
        });

        // Sort the user data
        res.data = sortUserDivData(res.data);

        // Filter the data based on usermode
        if (usermode !== null) {
            res.data = res.data.filter((item) => item.id === usermode.id);
        }

        const rightSideDiv = document.querySelector(".right-side");

        // Clear the right-side div
        rightSideDiv.innerHTML = "";

        // Create a table to display the user details
        const table = document.createElement("table");
        table.className = "table";

        // Create the search input and button
        const inputGroupDiv = document.createElement("div");
        inputGroupDiv.className = "input-group mb-3 px-3 pt-3";
        inputGroupDiv.innerHTML = `
                <input type="text" class="table-search form-control bg-transparent border border-dark-subtle" placeholder="Search" aria-label="Recipient's username" aria-describedby="button-addon2">
                <button class="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>
            `;
        rightSideDiv.appendChild(inputGroupDiv);

        // Add event listener for search input
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
        const headers = [
            "ID↑↓",
            "First Name↑↓",
            "Contact↑↓",
            "Created Date↑↓",
            "Details",
        ];
        const sortDirections = {
            "ID↑↓": false,
            "First Name↑↓": false,
            "Contact↑↓": false,
            "Created Date↑↓": false,
        };
        const mapdata = {
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
        // Handle error
    }
}

// Set the user div as active
function setUserDivActive() {
    const elements = document.querySelectorAll(
        "#users, #accounts, #transactions, #loans, #all-accounts"
    );
    elements.forEach((element) => {
        element.classList.add("border-dark-subtle");
    });
    userDiv.classList.remove("border-dark-subtle");
    userDiv.classList.add("border-dark");
}

// Sort the user div data
function sortUserDivData(data) {
    const activeUsers = data.filter((user) => user.isActive);
    const inactiveUsers = data.filter((user) => !user.isActive);

    activeUsers.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
    inactiveUsers.sort(
        (a, b) => new Date(a.createdDate) - new Date(b.createdDate)
    );

    return [...inactiveUsers, ...activeUsers];
}

// Render the user table body
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

// Create the user modal
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
        const toastLiveExample = document.getElementById("liveToast");
        const toastHeaderStrong = toastLiveExample.querySelector(
            ".toast-header strong"
        );
        const toastBody = toastLiveExample.querySelector(".toast-body");

        // Edit the toast content
        toastHeaderStrong.innerText = "UserMode Activated!";
        toastBody.innerText = `${user.firstName} ${user.lastName} is now in UserMode \n \n User ID: ${user.id} \n\n Redirecting....`;

        // Show the toast
        const toast = new bootstrap.Toast(toastLiveExample);
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
