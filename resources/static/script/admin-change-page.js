// Get the buttons by their IDs
const bookButton = document.getElementById('bookButton-admin');
const addBookButton = document.getElementById('addbookButton-admin');
const requestButton = document.getElementById('requestButton-admin');

// Add click event listeners
bookButton.addEventListener('click', function() {
    // Navigate to the book page
    window.location.href = 'admin-allbook.html'; // Replace 'book.html' with the URL of the book page
});

addBookButton.addEventListener('click', function() {
    // Navigate to the add book page
    window.location.href = 'admin-addbook.html'; // Replace 'addbook.html' with the URL of the add book page
});

requestButton.addEventListener('click', function() {
    // Navigate to the request page
    window.location.href = 'admin-getrequestBook.html'; // Replace 'request.html' with the URL of the request page
});
