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
  const newEmail = formData.get("emailAddress");

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate the email address
  if (!emailRegex.test(newEmail)) {
    transferBtnError.innerHTML = "Please enter a valid email address";
    transferBtn.classList.remove("disabled");
    return; // Stop the function if validation fails
  }

  // Prepare the data for the API request
  const data = {
    newEmail: formData.get("emailAddress"),
  };

  try {
    // Send the bank transfer request to the API
    const response = await axios.put(
      `${config.API_URL}/UserProfileUpdate/email/request-update`,
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
      toastBody.innerText = `${response.data.message}`;

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
      window.location.href = "./profile.html";
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
  // Validate the OTP (basic validation to check if it's not empty)
  if (!otp) {
    confirmBtnError.innerHTML = "OTP cannot be empty";
    otpContent.classList.remove("disabled");
    confirmBtn.classList.remove("disabled");
    return; // Stop the function if validation fails
  }
  try {
    // Verify the transaction with the OTP
    const response = await axios.put(
      `${config.API_URL}/UserProfileUpdate/email/verify-update`,
      {
        verificationCode: otp,
      },
      {
        withCredentials: true,
      }
    );

    // If the verification is successful, redirect to transactions.html
    if (response.status === 200) {
      var toastLiveExample = document.getElementById("liveToast");
      var toastHeaderStrong = toastLiveExample.querySelector(
        ".toast-header strong"
      );
      var toastBody = toastLiveExample.querySelector(".toast-body");

      // Edit the toast content
      toastHeaderStrong.innerText = "Successful";
      toastBody.innerText = `Email has been changed , Redirecting...`;

      // Show the toast
      var toast = new bootstrap.Toast(toastLiveExample);
      toast.show();

      setTimeout(() => {
        window.location.href = "./profile.html";
      }, 3000);
    }
  } catch (error) {
    // Display the error message and re-enable the confirm button and OTP content
    confirmBtnError.innerHTML = error.response.data.error;
    otpContent.classList.remove("disabled");
    confirmBtn.classList.remove("disabled");
  }
});
