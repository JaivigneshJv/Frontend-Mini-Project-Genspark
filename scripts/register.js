// Register button event listener with validations
document
  .querySelector(".login-btn")
  .addEventListener("click", async function (event) {
    event.preventDefault();

    // Input values
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

    // Validation
    let errorMessage = "";
    if (
      !username ||
      !password ||
      !confirmPassword ||
      !firstName ||
      !lastName ||
      !email ||
      !contact ||
      !dob
    ) {
      errorMessage = "All fields are required.";
    } else if (password !== confirmPassword) {
      errorMessage = "Passwords do not match.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errorMessage = "Invalid email format.";
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) {
      errorMessage = "Date of birth must be in DD/MM/YYYY format.";
    }

    if (errorMessage) {
      document.getElementById("error-msg").innerText = errorMessage;
      return;
    }

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
          dateOfBirth: new Date(
            dob.split("/").reverse().join("-")
          ).toISOString(),
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
        toastBody.innerText = "Redirecting...";

        // Show the toast
        var toast = new bootstrap.Toast(toastLiveExample);
        toast.show();

        // Redirect after 5 seconds
        setTimeout(() => {
          window.location.href = "./login.html";
        }, 5000);
      } else {
        // Display error message if registration fails
        document.getElementById("error-msg").innerText = response.data.message;
        console.error(response.data.message);
      }
    } catch (error) {
      // Display error message for server errors or invalid inputs
      document.getElementById("error-msg").innerText =
        "Registration failed. Please try again.";
    }
  });
