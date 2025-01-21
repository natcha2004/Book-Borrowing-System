//Function to format date
function formatDate(dateString) {
    // Check if the date string is not null or empty
    if (dateString) {
        // Parse the date string
        const date = new Date(dateString);
        // Format the date to display only the date portion
        const formattedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return formattedDate.toLocaleDateString(); // Return the formatted date string
    } else {
        // If the date string is null or empty, return an empty string
        return '';
    }
}

// Function to fetch data and populate the table
function fetchData() {
    // Make an AJAX request to fetch data from the backend
    fetch('http://localhost:8080/api/getrequestBook')
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
                        tableBody.innerHTML = '<tr><td colspan="8" class="centered-cell">No request Books.</td></tr>';
                        return;
                    }

                    // Clear existing content
                    const tableBody = document.querySelector('.table-body');
                    tableBody.innerHTML = '';
            data.forEach(book => {
                // Create a new row
                const row = document.createElement('tr');
                row.id = `row_${book.bid}`;

                // Create and append cells for each property
                ['date', 'username', 'bid', 'bname', 'borrow_check', 'borrow_date', 'return_date', 'return_check'].forEach(property => {
                    const cell = document.createElement('td');

                    // If property is 'borrow_check' or 'return_check', create a button to toggle the value
                    if (property === 'borrow_check') {
                        // Show the button only if borrow_date and return_date are both null
                        if (!book.borrow_date && !book.return_date) {
                            const button = document.createElement('button');
                            button.textContent = book[property] ? 'Checked' : 'Check';
                            button.onclick = () => toggleBorrowCheck(book.bid, button);
                            cell.appendChild(button);
                        } else if (book.borrow_date && book.return_date) {
                            // If borrow_date and return_date have values, display 'Checked' text
                            cell.textContent = 'Checked';
                        }
                    } else if (property === 'return_check') {
                        // Show the button only if borrow_date and return_date are not both null
                        if (book.borrow_date || book.return_date) {
                            const button = document.createElement('button');
                            button.textContent = book[property] ? 'Checked' : 'Check';
                            button.onclick = () => toggleReturnCheck(book.bid, button);
                            // Set the dataset.rowId attribute with the row ID
                            button.dataset.rowId = `row_${book.bid}`; // Assuming book.bid is the unique row ID
                            cell.appendChild(button);
                            // Check local storage for UI state and apply it if exists
                            const buttonState = localStorage.getItem(`buttonState_${book.bid}_return`);
                            if (buttonState === 'Complete') {
                                row.style.backgroundColor = '#d3f0d6';
                                button.style.display = 'none';
                            }
                            else {
                                row.style.backgroundColor = '#fffacd'; // Light yellow for waiting state
                            }
                        } else {
                            // If borrow_date and return_date are both null, display nothing
                            cell.textContent = '';
                        }
                    } else if (property === 'date' || property === 'borrow_date' || property === 'return_date') {
                        // Handle date properties formatting using formatDate function
                        cell.textContent = formatDate(book[property]);
                        cell.classList.add('centered-cell');
                    } else {
                        // For other properties, simply set the text content
                        cell.textContent = book[property];
                    }
                    // Add centered-cell class to each cell in the columns "borrow_check," "borrow_date," "return_date," and "return_check"
                    if (['borrow_check', 'borrow_date', 'return_date', 'return_check'].includes(property)) {
                         cell.classList.add('centered-cell');
                    }
                    row.appendChild(cell);
                });
                // Append the row to the table body
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to toggle the 'borrow_check' property value
function toggleBorrowCheck(bid, button) {
    // Toggle the text immediately
    button.textContent = button.textContent === 'Check' ? 'Checked' : 'Check';
    // Store the state of the button in localStorage
    localStorage.setItem(`buttonState_${bid}`, button.textContent);
    // Make an AJAX request to update the backend with the new value
    fetch(`http://localhost:8080/api/toggleBorrowCheck/${bid}`, {
        method: 'PUT',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Toggle response:', data); // Log the response from the server
        // If needed, update UI based on response
        if (button.textContent === 'Checked') {
            button.classList.add('checked'); // Add a CSS class to visually indicate the checked state
        } else {
            button.classList.remove('checked'); // Remove the CSS class if unchecked
        }
        // Reload the page after successful update
        window.location.reload();
    })
    .catch(error => {
        console.error('Error toggling borrow check:', error);
        // If there's an error, revert the button text
        button.textContent = button.textContent === 'Check' ? 'Checked' : 'Check';
    });
}
// Function to toggle the 'return_check' property value
function toggleReturnCheck(bid, button) {
    // Make an AJAX request to update the backend with the new value for returning the book
    fetch(`http://localhost:8080/api/toggleReturnCheck/${bid}`, {
        method: 'PUT',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Store the state of the button in localStorage
        localStorage.setItem(`buttonState_${bid}_return`, 'Complete');
        // Update UI based on response
        button.textContent = 'Complete';
        button.disabled = true; // Disable the button to prevent further clicks

        // Find the row using the dataset
        const rowId = button.dataset.rowId;
        console.log('Row ID:', rowId); // Debugging statement
        const row = document.getElementById(rowId);

        // Change the row background color to light green
        if (row) {
            row.style.backgroundColor = '#d3f0d6';
            // Hide the button in the 'return_check' column
            button.style.display = 'none';

            // After marking the book as returned, make it available for borrowing again
            makeBookAvailableForBorrowing(bid);
        } else {
            console.error('Error toggling return check: Row not found');
        }
    })
    .catch(error => {
        console.error('Error toggling return check:', error);
        // If there's an error, revert the button text and cell content
        button.textContent = 'Check';
    });
}

// Function to make the returned book available for borrowing again
function makeBookAvailableForBorrowing(bid) {
    // Make an AJAX request to update the backend to make the book available for borrowing again
    fetch(`http://localhost:8080/api/book/${bid}/make-available`, {
        method: 'PUT',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('Book made available for borrowing again');
    })
    .catch(error => {
        console.error('Error making book available for borrowing:', error);
        // Handle the error as needed
    });
}

window.onload = function() {
    fetchData();
};
