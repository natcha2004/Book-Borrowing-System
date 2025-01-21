document.addEventListener('DOMContentLoaded', function() {
    // Function to render cart items from local storage
    function renderCartItems() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const cartContainer = document.querySelector('.cart-items');
        cartContainer.innerHTML = ''; // Clear the container first

        cartItems.forEach(function(item) {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.imageSrc}" alt="Book Image">
                <div class="item-details">
                    <h3>${item.title}</h3>
                    <p>${item.id.replace('ID: ', '')}</p>
                    <p>${item.status.replace('Status: ', '')}</p>
                    <button class="remove-from-cart-button">&#10006;</button>
                </div>
            `;
            cartContainer.appendChild(cartItem);
        });
    }

    // Render cart items when the page is loaded
    renderCartItems();

    // Add event listener to the "Send" button
    const sendButton = document.querySelector('.send-button');
    sendButton.addEventListener('click', function() {
        // Retrieve the username from the login page
        var username = localStorage.getItem("username");

        // Retrieve all cart items from local storage
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if the number of cart items exceeds 5
        if (cartItems.length > 5) {
            alert('You can only send up to 5 books at a time.');
            return; // Exit the function if the limit is exceeded
        }

        // Proceed to send the cart items data to the server
        const booksWithUsername = cartItems.map(book => ({
            ...book,
            username: username,
            bid: book.id.replace('ID: ', ''), // Extracting bid from ID
            bname: book.title // Using title as bname
        }));

        fetch('http://localhost:8080/api/requestBook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(booksWithUsername)
        })
        .then(response => {
            if (response.ok) {
                return response.text(); // Return response text if successful
            } else if (response.status === 400) {
                return response.text().then(errorMessage => {
                    throw new Error(errorMessage); // Throw the server-provided error message
                });
            } else {
                throw new Error('Failed to send the cart data.'); // Throw error for other failures
            }
        })
        .then(data => {
            alert(data); // Show response message
            // Clear the cart after sending the data
            localStorage.removeItem('cart');
            renderCartItems(); // Render empty cart
        })
        .catch(error => {
            console.error('Error:', error.message);
            alert(error.message); // Display error message in popup
        });

    });

    // Add event listener to the "Remove from Cart" buttons
    const removeFromCartButtons = document.querySelectorAll('.remove-from-cart-button');
    removeFromCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = button.closest('.cart-item');
            const id = cartItem.querySelector('p:nth-of-type(1)').textContent.trim();
            removeFromCart(id);
            cartItem.remove();
            alert('Book removed from cart.');

            // Debug: Log cart items after removal
            console.log('Cart items after removal:', JSON.parse(localStorage.getItem('cart')));
        });
    });
});

// Function to remove a book from the cart in local storage
function removeFromCart(id) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Modify the provided ID to match the format stored in the cartItems array
    const modifiedId = 'ID: ' + id;

    // Filter out the item with the modified ID from the cartItems array
    cartItems = cartItems.filter(item => item.id !== modifiedId);

    // Update the localStorage with the modified cartItems array
    localStorage.setItem('cart', JSON.stringify(cartItems));

    // Debug: Log cart items after updating local storage
    console.log('Cart items after updating local storage:', JSON.parse(localStorage.getItem('cart')));
}

