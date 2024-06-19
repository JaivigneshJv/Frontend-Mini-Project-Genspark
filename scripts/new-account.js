document.querySelector(".submit-btn").addEventListener("click", async () => {
  // Disable the submit button to prevent multiple clicks
  document.querySelector(".submit-btn").classList.add("disabled");

  const form = document.querySelector("form");
  const formData = new FormData(form);

  const data = {
    accountType: formData.get("accountType"),
    initialDeposit: formData.get("initialDeposit"),
    transactionPassword: formData.get("transactionPassword"),
  };
  console.log(data);

  try {
    // Send the create account request to the API
    const response = await axios.post(
      `${config.API_URL}/Accounts/open-account`,
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
      toastHeaderStrong.innerText = "Account Created!";
      toastBody.innerText = "Your account has been successfully created.";

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
