// Get the UserMode Detail from the URL query parameters
const usermode = JSON.parse(localStorage.getItem("usermode-user"));

if (usermode !== null) {
  // Show the close button for user mode
  const usermodeClose = document.querySelector(".usermode-close");
  usermodeClose.classList.remove("d-none");

  // Update the heading with the active user's name
  const headingrightsidediv = document.querySelector(".left-side-heading p");
  headingrightsidediv.textContent = `Admin Dashboard [Active User - ${usermode.firstName}]`;

  // Initialize an empty array to store user mode accounts
  window.usermodeAccounts = [];

  // Function to fetch user mode accounts
  const getAccounts = async () => {
    try {
      const response = await axios.get(
        `${config.API_URL}/Admin/get-all-accounts/${usermode.id}`,
        {
          withCredentials: true,
        }
      );
      // Store the account IDs in the window.usermodeAccounts array
      window.usermodeAccounts = response.data.map((account) => account.id);
    } catch (err) {
      // Handle any errors
    }
  };

  // Call the getAccounts function
  getAccounts();
}

// Event listener for disabling the user mode
function closeUserMode() {
  // Remove the user mode data from local storage
  localStorage.removeItem("usermode-user");

  // Update the toast content
  var toastLiveExample = document.getElementById("liveToast");
  var toastHeaderStrong = toastLiveExample.querySelector(
    ".toast-header strong"
  );
  var toastBody = toastLiveExample.querySelector(".toast-body");
  toastHeaderStrong.innerText = "UserMode Deactivated!";
  toastBody.innerText = `Redirecting....`;

  // Show the toast
  var toast = new bootstrap.Toast(toastLiveExample);
  toast.show();

  // Reload the page after 3 seconds
  setTimeout(() => {
    window.location.reload();
  }, 3000);
}
