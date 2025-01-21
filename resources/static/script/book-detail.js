document.addEventListener('DOMContentLoaded', function() {
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Get the book ID from the URL parameters
    const bookId = getUrlParameter('bookId');

    // Fetch detailed information about the book using the book ID
    const apiUrl = `http://localhost:8080/api/book-detail/${bookId}`;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(book => {
            // Populate HTML elements with book details
            document.querySelector('.book-image img').src = book.pic;
            document.querySelector('.Description h2').innerText = book.bname;
            document.querySelector('.Description p:nth-of-type(1)').innerText = `ID: ${book.bid}`;
            document.querySelector('.Description p:nth-of-type(2)').innerText = `Author: ${book.author}`;
            document.querySelector('.Description p:nth-of-type(3)').innerText = `Category: ${book.category}`;
            document.querySelector('.Description p:nth-of-type(4)').innerText = `Description: ${book.description}`;
            document.querySelector('.Description p:nth-of-type(5)').innerText = `Status: ${book.status.replace('Status: ', '')}`;
            document.querySelector('.overall-rating').innerText = `${book.overall_rating}`;

            // Check if the book status is "available"
            if (book.status === 'available') {
                // If the book is available, hide the update button
                document.querySelector('.update-button').style.display = 'none';
            }
        })
        .catch(error => console.error('Error fetching book details:', error));
});
