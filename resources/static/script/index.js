document.getElementById("LoginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get username and password from the form
    var username = document.getElementById("username").value;
    var upassword = document.getElementById("password").value;

    // Example API endpoint for authentication
    var apiUrl = "http://localhost:8080/api/user/" + encodeURIComponent(username) + "/" + encodeURIComponent(upassword);

    // Send a GET request to the API endpoint
    fetch(apiUrl)
    .then(response => {
        console.log("Response status code:", response.status); // Log the response status code
        if (response.ok) {
            return response.json(); // Parse the response as JSON
        } else if (response.status === 500) { // Unauthorized (wrong password)
            throw new Error('Wrong password.');
        } else if (response.status === 404){
            throw new Error('User not found.')
        } else {
            throw new Error('Network response was not ok.');
        }
    })
    .then(user => {
        // Store the username in localStorage
        localStorage.setItem("username", username);
        localStorage.setItem("password", upassword);

        // Check the user type
        switch (user.type) {
            case "admin":
                // Redirect to admin page
                window.location.href = "admin.html";
                break;
            case "user":
                // Redirect to user page
                window.location.href = "home1.html";
                break;
            default:
                document.getElementById("message").innerText = "Login failed. Unknown user type.";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        if (error.message === 'User not found.') {
            document.getElementById("message").innerText = error.message;;
        } else if (error.message === 'Wrong password.') {
            document.getElementById("message").innerText = error.message; // Display the custom error message for wrong password
        } else {
            document.getElementById("message").innerText = "An error occurred while processing your request. Please try again later.";
        }
    });

});
