// Function to load content into the contentFrame element
function loadContent(url) {
  document.getElementById("contentFrame").src = url;
}

// Event listener for when the DOM content has loaded
document.addEventListener("DOMContentLoaded", () => {
  // Get all the anchor tags on the page
  const links = document.querySelectorAll("a");

  // Add click event listener to each anchor tag
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent the default link behavior

      // Remove the 'active' class from all anchor tags
      links.forEach((l) => l.classList.remove("active"));

      // Add the 'active' class to the clicked anchor tag
      link.classList.add("active");

      // Extract the URL from the onclick attribute and load the content
      loadContent(
        link
          .getAttribute("onclick")
          .replace("loadContent('", "")
          .replace("')", "")
      );
    });
  });
});

// Event listener for when the window has finished loading
window.onload = function () {
  // Add the 'active' class to the dashboard-link element
  document.getElementById("dashboard-link").classList.add("active");

  // Run the function immediately on page load
  getUserProfile();

  // Then run the function every minute
  setInterval(getUserProfile, 60 * 1000);
};

async function getUserProfile() {
  try {
    // Make a GET request to the user profile API endpoint
    const response = await axios.get(`${config.API_URL}/User/profile`, {
      withCredentials: true,
    });
  } catch (error) {
    console.log(error);
    // Redirect to the login page if there's an error
    window.location.href = "../auth/login.html";
  }
}
// Event listener for the logout button click
document
  .getElementById("logout-btn")
  .addEventListener("click", async function () {
    try {
      // Make a POST request to the logout API endpoint
      const response = await axios.post(
        `${config.API_URL}/Auth/logout`,
        {},
        {withCredentials: true}
      );

      // Redirect to the index page if the logout is successful
      if (response.status === 200) {
        var toastLiveExample = document.getElementById("liveToast");
        var toastHeaderStrong = toastLiveExample.querySelector(
          ".toast-header strong"
        );
        var toastBody = toastLiveExample.querySelector(".toast-body");

        // Edit the toast content
        toastHeaderStrong.innerText = "Logged Out";
        toastBody.innerText = "redirecting...";

        // Show the toast
        var toast = new bootstrap.Toast(toastLiveExample);
        toast.show();

        // Redirect after 5 seconds
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 5000);
      }
    } catch (error) {
      window.location.href = "../index.html";
      console.log(error);
    }
  });
