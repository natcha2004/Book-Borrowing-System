// search-result.js

// Function to retrieve URL query parameter by name
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to fetch books based on search term
function fetchBooks(searchTerm) {
    // Make AJAX request to fetch books
    fetch('http://localhost:8080/api/book/' + searchTerm)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Display the fetched books
            displayBooks(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Function to display books on the page
// Function to display books on the page
function displayBooks(books) {
    const searchResultsDiv = document.getElementById('searchResults');
    searchResultsDiv.innerHTML = ''; // Clear previous results

    if (books.length === 0) {
        searchResultsDiv.textContent = 'No books found.';
    } else {
        books.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('book'); // Add a class for styling if needed

            // Create and set up elements for the book display
            const img = document.createElement('img');
            img.src = book.pic;
            img.alt = book.bname;
            bookDiv.appendChild(img);

            const title = document.createElement('h2');
            title.textContent = book.bname;
            bookDiv.appendChild(title);

            const author = document.createElement('p');
            author.textContent = 'Author: ' + book.author;
            bookDiv.appendChild(author);

            const status = document.createElement('p');
            status.textContent = 'Status: ' + book.status;
            bookDiv.appendChild(status);

            const rating = document.createElement('p');
            rating.textContent = 'Rating: ' + book.overall_rating;
            bookDiv.appendChild(rating);

            // Add click event listener to redirect to book detail page
            bookDiv.addEventListener('click', () => {
                window.location.href = `http://localhost:8080/book-detail.html?bookId=${book.bid}`;
            });

            // Append the bookDiv to the searchResultsDiv
            searchResultsDiv.appendChild(bookDiv);
        });
    }
}

// Entry point
window.onload = function() {
    // Get the search term from the URL query parameter
    const searchTerm = getQueryParam('search');
    if (searchTerm) {
        // Fetch books based on the search term
        fetchBooks(searchTerm);
    } else {
        // No search term provided, display a message
        const searchResultsDiv = document.getElementById('searchResults');
        searchResultsDiv.textContent = 'No search term provided.';
    }
};
