document.addEventListener("DOMContentLoaded", function() {
    // Find the button elements
    var homeButton = document.getElementById("homeButton");
    var homeLink = document.getElementById("homeLink");
    var basketButton = document.querySelector('.basket-icon');
    var userButton = document.querySelector('.user-icon');
    var myprofileLink = document.getElementById("myprofileLink");

    // Add click event listener to the home icon button
    homeButton.addEventListener("click", function() {
        window.location.href = "home1.html";
    });

    // Add click event listener to the "Home" text link
    homeLink.addEventListener("click", function(event) {
        event.preventDefault();
        window.location.href = "home1.html";
    });

    // Add click event listener to the basket icon button
    basketButton.addEventListener('click', function() {
        window.location.href = 'cart.html';
    });


    // Add click event listener to the user icon button
    userButton.addEventListener('click', function() {
        // Retrieve the username from localStorage
        var username = localStorage.getItem("username");
        console.log("Username:", username); // Debugging
        if (username) {
            var upassword = localStorage.getItem("password");
            console.log("Password:", upassword); // Debugging
            window.location.href = `myprofile.html?username=${encodeURIComponent(username)}&upassword=${encodeURIComponent(upassword)}`;
        } else {
            console.error("Username not found in localStorage.");
        }
    });

    // Set href attribute of the myprofile link with username and upassword parameters
    var username = localStorage.getItem("username");
    var upassword = localStorage.getItem("password");
    if (username && upassword) {
        myprofileLink.href = `myprofile.html?username=${encodeURIComponent(username)}&upassword=${encodeURIComponent(upassword)}`;
    } else {
        console.error("Username or upassword not found in localStorage.");
    }


});
