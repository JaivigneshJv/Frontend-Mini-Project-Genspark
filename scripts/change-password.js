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
    oldPassword: formData.get("originalTransactionPassword"),
    newPassword: formData.get("transactionPassword"),
  };

  try {
    // Send the create account request to the API
    const response = await axios.put(
      `${config.API_URL}/UserProfileUpdate/update-password`,
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
      toastHeaderStrong.innerText = "Password Changed!";
      toastBody.innerText =
        "Your User account password has been successfully changed.";

      // Show the toast
      var toast = new bootstrap.Toast(toastLiveExample);
      toast.show();
      setTimeout(() => {
        window.location.href = "./profile.html";
      }, 3000);
    }
  } catch (error) {
    document.querySelector(".submit-btn").classList.remove("disabled");
    // If the request is unsuccessful, show the error message
    var toastLiveExample = document.getElementById("liveToast");
    var toastHeaderStrong = toastLiveExample.querySelector(
      ".toast-header strong"
    );
    var toastBody = toastLiveExample.querySelector(".toast-body");

    // Edit the toast content
    toastHeaderStrong.innerText = "Error!";
    toastBody.innerText = `${error.response.data}. Please try again.`;

    // Show the toast
    var toast = new bootstrap.Toast(toastLiveExample);
    toast.show();
  }
});
