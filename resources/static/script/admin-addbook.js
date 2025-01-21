document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('confirmButton').addEventListener('click', function() {
        // Retrieve input values
        var bookID = document.getElementById('bookIDInput').value;
        var bookName = document.getElementById('bookNameInput').value;
        var bookAuthor = document.getElementById('bookAuthorInput').value;
        var bookCategory = document.getElementById('bookCategoryInput').value;
        var bookStatus = document.getElementById('bookStatusInput').value;
        var bookDescription = document.getElementById('bookDescriptionInput').value;
        var bookOverallRating = document.getElementById('bookOverallRatingInput').value;
        var bookImage = document.getElementById('bookImageInput').value;

        // Create a new book object
        var newBook = {
            bid: bookID,
            bname: bookName,
            author: bookAuthor,
            category: bookCategory,
            status: bookStatus,
            description: bookDescription,
            overall_rating: bookOverallRating,
            pic: bookImage
        };

        // Send a POST request to the API endpoint
        fetch('http://localhost:8080/api/addbook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBook)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add book');
            }
            return response.json();
        })
        .then(data => {
            alert('Book added successfully!'); // Display success message
            location.reload(); // Reload the page
        })
        .catch(error => {
            alert('Failed to add book. Please try again.'); // Display error message
            console.error('Error adding book:', error.message);
        });
    });
});
