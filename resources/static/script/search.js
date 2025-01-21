// search.js

// Function to handle form submission
function handleSearch(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the value from the search input
    var searchTerm = document.getElementById('searchInput').value;

    // Perform the search
    searchBook(searchTerm);
}

// Function to perform the search and redirect to home3.html
function searchBook(searchTerm) {
    // Perform any necessary validation of the search term here

    // Redirect to home3.html with the search term as a query parameter
    window.location.href = 'search.html?search=' + encodeURIComponent(searchTerm);
}

// Add event listener to the form submit event
document.getElementById('searchForm').addEventListener('submit', handleSearch);
