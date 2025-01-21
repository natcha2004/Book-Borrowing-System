var apiUrl = "http://localhost:8080/api/allbook";
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const bookList = document.getElementById('allbook');
        data.forEach(book => {
            const bookDiv = document.createElement('div');
            let statusBackground;
                        if (book.status === 'available') {
                            statusBackground = '#5DBB63'; // Custom shade of green (Light Green)
                        } else if (book.status === 'not available') {
                            statusBackground = '#FF4D4D'; // Custom shade of red (Tomato)
                        }
            bookDiv.innerHTML = `
                <img src="${book.pic}" alt="${book.bname}" width="150">
                <h3>${book.bname}</h3>
                <p>Author: ${book.author}</p>
                <p>Category: ${book.category}</p>
                <p>Overall Rating: ${book.overall_rating}</p>
                <p><span class="status-frame" style="background-color: ${statusBackground};">Status: ${book.status}</span></p>
                 `;

                 bookDiv.addEventListener('click', () => {
                 window.location.href = `http://localhost:8080/admin-book-detail.html?bookId=${book.bid}`;
                 });
                 bookList.appendChild(bookDiv);
        });
    })
    .catch(error => console.error('Error fetching books:', error));

