// Get the transaction type from the URL query parameters
const params = new URLSearchParams(window.location.search);
const transactionType = params.get("type");

// Display the transaction type in the heading
const heading = document.querySelector(".heading-text");
heading.innerHTML = "";
if (transactionType === "IMPS") {
  heading.innerHTML = "IMPS";
} else if (transactionType === "NEFT") {
  heading.innerHTML = "NEFT";
} else if (transactionType === "RTGS") {
  heading.innerHTML = "RTGS";
} else {
  // Redirect to dashboard if the transaction type is not recognized
  window.location.href = `dashboard.html`;
}

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

// Get the necessary elements from the DOM
const transferContent = document.querySelector(".transaction-content");
const transferBtn = document.querySelector(".transfer-btn");
const transferBtnError = document.querySelector(".transfer-btn-error");
const otpContent = document.querySelector(".otp-content");
const confirmBtn = document.querySelector(".confirm-btn");
const confirmBtnError = document.querySelector(".confirm-btn-error");

// Add event listener for the transfer button click
transferBtn.addEventListener("click", async () => {
  // Disable the transfer button to prevent multiple clicks
  transferBtn.classList.add("disabled");

  // Get the form data
  const form = document.querySelector("form");
  const formData = new FormData(form);
  console.log(formData);

  // Prepare the data for the API request
  const data = {
    amount: formData.get("amount"),
    transactionPassword: formData.get("transactionPassword"),
    transactionType: transactionType,
  };

  try {
    // Send the bank transfer request to the API
    const senderAccount = formData.get("account");
    const beneficiaryAccountNumber = formData.get("beneficiaryAccountNumber");
    const response = await axios.post(
      `${config.API_URL}/Transaction/bank-transfer/${senderAccount}/${beneficiaryAccountNumber}`,
      data,
      {
        withCredentials: true,
      }
    );
    console.log(response.data);

    // If the request is successful, show the OTP content
    if (response.status === 200) {
      var toastLiveExample = document.getElementById("liveToast");
      var toastHeaderStrong = toastLiveExample.querySelector(
        ".toast-header strong"
      );
      var toastBody = toastLiveExample.querySelector(".toast-body");

      // Edit the toast content
      toastHeaderStrong.innerText = "OTP Sent!";
      toastBody.innerText = "Enter the OTP to complete the transaction.";

      // Show the toast
      var toast = new bootstrap.Toast(toastLiveExample);
      toast.show();

      transferContent.classList.add("d-none");
      otpContent.classList.remove("d-none");
    }
  } catch (error) {
    // Display the error message and redirect after 3 seconds
    transferBtnError.innerHTML = error.response.data.error + " redirecting!";
    setTimeout(() => {
      window.location.href = "transactions.html";
    }, 3000);

    // Re-enable the transfer button
    transferBtn.classList.remove("disabled");
    console.error(error);
  }
});

// Add event listener for the confirm button click
confirmBtn.addEventListener("click", async () => {
  // Disable the confirm button and OTP content
  otpContent.classList.add("disabled");
  confirmBtn.classList.add("disabled");

  // Get the form data
  const form = document.querySelector("form");
  const formData = new FormData(form);
  const form1 = document.querySelector("#otp-form");
  const formData1 = new FormData(form1);
  const otp = formData1.get("otp");
  const senderAccount = formData.get("account");

  try {
    // Verify the transaction with the OTP
    const response = await axios.post(
      `${config.API_URL}/Transaction/transfer/verify-transaction/${senderAccount}/${otp}`,
      {},
      {
        withCredentials: true,
      }
    );

    // If the verification is successful, redirect to transactions.html
    if (response.status === 200) {
      console.log(transactionType);
      if (transactionType !== "IMPS") {
        confirmBtnError.innerHTML =
          "Transaction Request Has been Raised! Redirecting...";
        var toastLiveExample = document.getElementById("liveToast");
        var toastHeaderStrong = toastLiveExample.querySelector(
          ".toast-header strong"
        );
        var toastBody = toastLiveExample.querySelector(".toast-body");

        // Edit the toast content
        toastHeaderStrong.innerText = "Transaction Request Raised!";
        toastBody.innerText = "Wait for it to be accepted , Redirecting...";

        // Show the toast
        var toast = new bootstrap.Toast(toastLiveExample);
        toast.show();
        setTimeout(() => {
          window.location.href = "transactions.html";
        }, 5000);
      } else {
        var toastLiveExample = document.getElementById("liveToast");
        var toastHeaderStrong = toastLiveExample.querySelector(
          ".toast-header strong"
        );
        var toastBody = toastLiveExample.querySelector(".toast-body");

        // Edit the toast content
        toastHeaderStrong.innerText = "Transaction Successful";
        toastBody.innerText = "Redirecting you to the main page...";

        // Show the toast
        var toast = new bootstrap.Toast(toastLiveExample);
        toast.show();

        confirmBtnError.innerHTML = "Transaction Successful! Redirecting...";
        setTimeout(() => {
          window.location.href = "transactions.html";
        }, 3000);
      }
    }
  } catch (error) {
    // Display the error message and re-enable the confirm button and OTP content
    confirmBtnError.innerHTML = error.response.data.error;
    otpContent.classList.remove("disabled");
    confirmBtn.classList.remove("disabled");
  }
});
