window.onload = async () => {
  await checkLogin();
};
//Check Login Session
const checkLogin = async () => {
  try {
    const response = await axios.get(`${config.API_URL}/User/profile`, {
      withCredentials: true,
    });

    if (response.status === 200) {
      // User is logged in
      return;
    }
  } catch (error) {
    // Redirect to the login page if the user is not logged in
    window.location.href = "../index.html";
  }
};

// Get the transaction type from the URL query parameters
const params = new URLSearchParams(window.location.search);
const loanId = params.get("id");

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

  // Prepare the data for the API request
  const data = {
    loanId: loanId,
    amount: formData.get("Amount"),
    paymentDate: new Date().toISOString(),
  };

  try {
    // Send the bank transfer request to the API
    const response = await axios.post(
      `${config.API_URL}/Loan/repay-loan/${loanId}`,
      data,
      {
        withCredentials: true,
      }
    );

    // If the request is successful, show the OTP content
    if (response.status === 200) {
      var toastLiveExample = document.getElementById("liveToast");
      var toastHeaderStrong = toastLiveExample.querySelector(
        ".toast-header strong"
      );
      var toastBody = toastLiveExample.querySelector(".toast-body");

      // Edit the toast content
      toastHeaderStrong.innerText = "Success";
      toastBody.innerText = `Loan Repayment Successful! Redirecting...`;

      // Show the toast
      var toast = new bootstrap.Toast(toastLiveExample);
      toast.show();
      setTimeout(() => {
        window.location.href = "./loans.html";
      }, 3000);
    }
  } catch (error) {
    // Display the error message and redirect after 3 seconds
    transferBtnError.innerHTML = error.response.data.error + " redirecting!";
    // Re-enable the transfer button
    transferBtn.classList.remove("disabled");
    console.error(error);
  }
});
