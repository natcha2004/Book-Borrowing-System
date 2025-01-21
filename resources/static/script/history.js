// Function to fetch borrowing history data and populate the table
function populateHistoryTable() {
    // Retrieve username from localStorage
    const username = localStorage.getItem("username");

    // Check if username is present
    if (!username) {
        console.error("Username not found in localStorage.");
        return;
    }

    // Fetch borrowing history data using the username
    fetch(`http://localhost:8080/api/myhistory/${username}`)
        .then(response => {
                    console.log("Response status:", response.status);
                    if (response.status === 404) {
                        // Display message indicating no book borrowings
                        const tableBody = document.querySelector('.table-body');
                        console.log('Table body:', tableBody);
                        return; // Exit the function
                    }
                    return response.json();
                })
                .then(data => {
                    if (!data || data.length === 0) {
                        // If data is still empty or null, display the message
                        const tableBody = document.querySelector('.table-body');
                        tableBody.innerHTML = '<tr><td colspan="4" class="centered-cell">You have not borrowed any books yet.</td></tr>';
                        return;
                    }

                    // Clear existing content
                    const tableBody = document.querySelector('.table-body');
                    tableBody.innerHTML = '';

            // Loop through the data and create table rows
            data.forEach(book => {
                // Create a new row
                const row = document.createElement('tr');
                console.log('Creating row:', row);

                // Create and append cells for each property
                ['bid', 'bname', 'borrow_date', 'return_date'].forEach(property => {
                    const cell = document.createElement('td');
                    // If property is 'borrow_date' or 'return_date', format the date to display only the date portion
                    if (property === 'borrow_date' || property === 'return_date') {
                        const date = new Date(book[property]);
                        cell.textContent = date.toLocaleDateString();
                    } else {
                        cell.textContent = book[property];
                    }

                    if (['borrow_date', 'return_date'].includes(property)) {
                         cell.classList.add('centered-cell');
                    }
                    row.appendChild(cell);
                });

                // Append the row to the table body
                tableBody.appendChild(row);
                console.log('Row appended:', row);
            });
        })

        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Call the populateHistoryTable function when the page loads
window.onload = function() {
    populateHistoryTable();
};
