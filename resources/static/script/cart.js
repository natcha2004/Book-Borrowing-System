document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded.');

    // Get the "Add to cart" button
    const addToCartButton = document.querySelector('.add-to-cart-button');
    console.log('Add to cart button:', addToCartButton);

    // Add click event listener to the "Add to cart" button
    addToCartButton.addEventListener('click', function() {
        console.log('Add to cart button clicked.');

        // Get the book details
        const title = document.querySelector('.book h2').textContent;
        const id = document.querySelector('.book p:nth-of-type(1)').textContent.trim(); // Update the selector here
        const status = document.querySelector('.book p:nth-of-type(5)').textContent.trim(); // Update the selector here
        const imageSrc = document.querySelector('.book-image img').getAttribute('src');

        // Check if the book is available
        if (status.toLowerCase() === 'status: not available') {
            // Display a message indicating that the book can't be added to the cart
            alert("Sorry, this book is not available and can't be added to the cart.");
            return; // Stop further execution of the function
        }

        // Check if the book already exists in the cart
        if (isBookInCart(id)) {
            alert("This book is already in your cart.");
            return;
        }

        // Create an object to store the book details
        const book = {
            title: title,
            id: id,
            status: status,
            imageSrc: imageSrc
        };

        console.log('Book details:', book);

        // Check if local storage is supported by the browser
        if (typeof(Storage) !== "undefined") {
            // Retrieve existing cart items from local storage or initialize an empty array
            let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

            // Add the current book to the cart items array
            cartItems.push(book);

            // Store the updated cart items array back into local storage
            localStorage.setItem('cart', JSON.stringify(cartItems));

            // Provide feedback to the user
            alert('Book added to cart successfully!');
        } else {
            // Local storage is not supported
            alert('Local storage is not supported in your browser. Please use a modern browser to use this feature.');
        }
    });

    // Function to check if the book already exists in the cart
    function isBookInCart(id) {
        // Retrieve cart items from local storage
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if any book in the cart has the same id
        return cartItems.some(item => item.id === id);
    }
});
