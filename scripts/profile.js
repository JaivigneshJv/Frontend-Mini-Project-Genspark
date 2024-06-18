// Make a GET request to the API endpoint for user profile
axios
    .get(`${config.API_URL}/User/profile`, {
        withCredentials: true,
    })
    .then((response) => {
        // Log the response data
        console.log(response.data);

        // Extract the data from the response
        const data = response.data;

        // Update the HTML elements with the user profile information
        document.querySelector(".profile p").textContent = `${data.firstName} ${data.lastName}`;
        document.querySelector(".email-details p").textContent = data.email;
        document.querySelector(".dob-details p").textContent = new Date(data.dateOfBirth).toLocaleDateString();
        document.querySelector(".contact-details p").textContent = data.contact;
        document.querySelector(".created-container").textContent = `Created: ${new Date(data.createdDate).toLocaleDateString()} ${new Date(data.createdDate).toLocaleTimeString()}`;
    })
    .catch((error) => {
        // Log any errors that occur during the request
        console.error(error);
    });
