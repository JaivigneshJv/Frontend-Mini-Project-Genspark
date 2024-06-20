// Register button event listener
document
  .querySelector(".login-btn")
  .addEventListener("click", async function (event) {
    event.preventDefault();

    const username = document.querySelector(
      'input[placeholder="USERNAME"]'
    ).value;
    const password = document.querySelector(
      'input[placeholder="PASSWORD"]'
    ).value;
    const confirmPassword = document.querySelector(
      'input[placeholder="CONFIRM PASSWORD"]'
    ).value;
    const firstName = document.querySelector(
      'input[placeholder="FIRST NAME"]'
    ).value;
    const lastName = document.querySelector(
      'input[placeholder="LAST NAME"]'
    ).value;
    const email = document.querySelector('input[placeholder="EMAIL"]').value;
    const contact = document.querySelector(
      'input[placeholder="CONTACT"]'
    ).value;
    const dob = document.querySelector(
      'input[placeholder="DOB (DD/MM/YYYY)"]'
    ).value;

    try {
      const response = await axios.post(
        `${config.API_URL}/Auth/register`,
        {
          username: username,
          password: password,
          firstName: firstName,
          lastName: lastName,
          email: email,
          contact: contact,
          dateOfBirtth: new Date(dob).toISOString(),
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        // Select the toast elements
        var toastLiveExample = document.getElementById("liveToast");
        var toastHeaderStrong = toastLiveExample.querySelector(
          ".toast-header strong"
        );
        var toastBody = toastLiveExample.querySelector(".toast-body");

        // Edit the toast content
        toastHeaderStrong.innerText = "Registration successful";
        toastBody.innerText = "redirecting...";

        // Show the toast
        var toast = new bootstrap.Toast(toastLiveExample);
        toast.show();

        // Redirect after 5 seconds
        setTimeout(() => {
          window.location.href = "./login.html";
        }, 5000);
      } else {
        // Display error message if login fails
        document.getElementById("error-msg").innerText = response.data.message;
        console.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      // Display error message for invalid credentials
      document.getElementById("error-msg").innerText = "Invalid Credentials";
    }
  });
