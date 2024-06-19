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
    console.log(response.data);

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
    console.error(error);
  }
}

// Call the loadAccounts function to populate the accounts dropdown
loadAccounts();

function togglePasswordVisibility(inputId, imgId) {
  var input = document.getElementById(inputId);
  var img = document.getElementById(imgId);
  if (input.type === "password") {
    input.type = "text";
    input.classList.add = "bg-transparent";
    input.classList.remove = "bg-dark";
    img.src = "../../node_modules/bootstrap-icons/icons/eye-slash-fill.svg"; // change to eye-slash icon
  } else {
    input.type = "password";
    input.classList.remove = "bg-transparent";
    input.classList.add = "bg-dark";
    img.src = "../../node_modules/bootstrap-icons/icons/eye-fill.svg"; // change back to eye icon
  }
}

document.querySelector(".submit-btn").addEventListener("click", async () => {
  // Disable the submit button to prevent multiple clicks
  document.querySelector(".submit-btn").classList.add("disabled");

  const form = document.querySelector("form");
  const formData = new FormData(form);
  const accountId = formData.get("account");
  const data = {
    transactionPassword: formData.get("transactionPassword"),
  };
  console.log(data);

  try {
    // Send the create account request to the API
    const response = await axios.put(
      `${config.ADMIN_URL}/change-transaction-password${accountId}`,
      data,
      {
        withCredentials: true,
      }
    );
    // console.log(response.data);

    // If the request is successful, show the success message
    if (response.status === 200) {
      var toastLiveExample = document.getElementById("liveToast");
      var toastHeaderStrong = toastLiveExample.querySelector(
        ".toast-header strong"
      );
      var toastBody = toastLiveExample.querySelector(".toast-body");

      // Edit the toast content
      toastHeaderStrong.innerText = "Password Changed!";
      toastBody.innerText =
        "Your account transaction password has been successfully created.";

      // Show the toast
      var toast = new bootstrap.Toast(toastLiveExample);
      toast.show();
      setTimeout(() => {
        window.location.href = "../auth/login.html";
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
