var apiUrl = "http://localhost:8080/api/bestbook";
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const bookList = document.getElementById('bestbookList');
        data.forEach(book => {
            const bookDiv = document.createElement('div');
            let statusBackground;
                     if (book.status === 'available') {
                             statusBackground = '#5DBB63'; // Custom shade of green (Light Green)
                     } else if (book.status === 'not available') {
                             statusBackground = '#FF4D4D'; // Custom shade of red (Tomato)
                     }
            bookDiv.innerHTML = `
                <img src="${book.pic}" alt="${book.bname}" width="170">
                <h2>${book.bname}</h2>
                <p>Author: ${book.author}</p>
                <p>Overall Rating: ${book.overall_rating}</p>
                <p><span class="status-frame" style="background-color: ${statusBackground};">Status: ${book.status}</span></p>
                `;
            // Add a click event listener to the book element
            bookDiv.addEventListener('click', () => {
                // Redirect to the detail page when the book is clicked
                window.location.href = `http://localhost:8080/book-detail.html?bookId=${book.bid}`;
            });
            bookList.appendChild(bookDiv);
        });
    })
    .catch(error => console.error('Error fetching books:', error));
