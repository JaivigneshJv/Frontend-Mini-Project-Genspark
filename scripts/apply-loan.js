// Load the accounts asynchronously
async function loadAccounts() {
  try {
    // Fetch the accounts data from the API
    const response = await axios.get(
      `${config.API_URL}/Accounts/get-all-accounts`,
      {
        withCredentials: true,
      }
    );
    // Populate the select dropdown with the account options
    const select = document.querySelector("select");
    response.data.forEach((account) => {
      const option = document.createElement("option");
      option.value = account.id;
      let id = account.id;
      let maskedId =
        "*".repeat(id.length - 24) +
        id.slice(-10) +
        " -- Balance : " +
        account.balance;
      option.innerHTML = maskedId;
      option.classList.add("bg-transparent", "border-dark");
      select.appendChild(option);
    });
  } catch (error) {
    window.location.href = "../index.html";
  }
}

window.onload = () => {
  // Call the loadAccounts function to populate the accounts dropdown
  loadAccounts();
};

document.querySelector(".interest-btn").addEventListener("click", async () => {
  // Disable the submit button to prevent multiple clicks
  document.querySelector(".interest-btn").classList.add("disabled");
  const form = document.querySelector("form");
  const formData = new FormData(form);
  const data = {
    amount: formData.get("loanAmount"),
    appliedDate: new Date().toISOString(),
    targetDate: new Date(formData.get("targetDate")).toISOString(),
  };
  try {
    // Send the create account request to the API
    const response = await axios.post(
      `${config.API_URL}/Loan/get-loan-details`,
      data,
      {
        withCredentials: true,
      }
    );

    // If the request is successful, show the success message
    if (response.status === 200) {
      var toastLiveExample = document.getElementById("liveToast");
      var toastHeaderStrong = toastLiveExample.querySelector(
        ".toast-header strong"
      );
      var toastBody = toastLiveExample.querySelector(".toast-body");

      // Edit the toast content
      toastHeaderStrong.innerText = "Interest Details!";
      toastBody.innerText = `Your loan interest is ${response.data.interestRate}% and the total amount to be paid is ${response.data.finalAmount}.`;

      // Show the toast
      var toast = new bootstrap.Toast(toastLiveExample);
      toast.show();
      setTimeout(() => {
        document.querySelector(".interest-btn").classList.remove("disabled");
      }, 3000);
    }
  } catch (error) {
    // If the request is unsuccessful, show the error message
    var toastLiveExample = document.getElementById("liveToast");
    var toastHeaderStrong = toastLiveExample.querySelector(
      ".toast-header strong"
    );
    var toastBody = toastLiveExample.querySelector(".toast-body");

    // Edit the toast content
    toastHeaderStrong.innerText = "Error!";
    toastBody.innerText = "An error occurred. Please try again.";

    // Show the toast
    var toast = new bootstrap.Toast(toastLiveExample);
    toast.show();
    setTimeout(() => {
      window.location.href = "./dashboard.html";
    }, 3000);
  }
});

document.querySelector(".submit-btn").addEventListener("click", async () => {
  // Disable the submit button to prevent multiple clicks
  document.querySelector(".submit-btn").classList.add("disabled");

  const form = document.querySelector("form");
  const formData = new FormData(form);

  const data = {
    accountId: formData.get("account"),
    amount: formData.get("loanAmount"),
    appliedDate: new Date().toISOString(),
    targetDate: new Date(formData.get("targetDate")).toISOString(),
  };

  try {
    // Send the create account request to the API
    const response = await axios.post(
      `${config.API_URL}/Loan/apply-loan`,
      data,
      {
        withCredentials: true,
      }
    );
    //

    // If the request is successful, show the success message
    if (response.status === 200) {
      var toastLiveExample = document.getElementById("liveToast");
      var toastHeaderStrong = toastLiveExample.querySelector(
        ".toast-header strong"
      );
      var toastBody = toastLiveExample.querySelector(".toast-body");

      // Edit the toast content
      toastHeaderStrong.innerText = "Loan Request Created!";
      toastBody.innerText = "Your Loan Request has been successfully created.";

      // Show the toast
      var toast = new bootstrap.Toast(toastLiveExample);
      toast.show();
      setTimeout(() => {
        window.location.href = "./dashboard.html";
      }, 3000);
    }
  } catch (error) {
    // If the request is unsuccessful, show the error message
    var toastLiveExample = document.getElementById("liveToast");
    var toastHeaderStrong = toastLiveExample.querySelector(
      ".toast-header strong"
    );
    var toastBody = toastLiveExample.querySelector(".toast-body");

    // Edit the toast content
    toastHeaderStrong.innerText = "Error!";
    toastBody.innerText = "An error occurred. Please try again.";

    // Show the toast
    var toast = new bootstrap.Toast(toastLiveExample);
    toast.show();
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 3000);
  }
});
