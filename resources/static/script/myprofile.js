// Function to fetch user information from the API
function fetchUserInformation() {
    // Retrieve username and upassword from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const upassword = urlParams.get('upassword');

    // Check if username and upassword are not null
    if (username && upassword) {
        // Construct the API endpoint URL
        const apiUrl = `http://localhost:8080/api/user/${username}/${upassword}`;

        // Fetch user information from the API
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(user => {
                // Populate form fields with user information
                document.getElementById('nameInput').innerHTML = user.firstname;
                document.getElementById('surnameInput').innerHTML = user.lastname;
                document.getElementById('idInput').innerHTML = user.username;
                document.getElementById('passwordInput').innerHTML = user.upassword;
                document.getElementById('facultyInput').innerHTML = user.faculty;
                document.getElementById('statusInput').innerHTML = user.type;
            })
            .catch(error => {
                console.error('Error fetching user information:', error);
            });
    } else {
        console.error("Username or upassword not found in URL.");
    }
}

// Call fetchUserInformation function when the page loads
window.onload = fetchUserInformation;
