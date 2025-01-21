document.addEventListener("DOMContentLoaded", function() {
    const deleteButton = document.querySelector(".delete-button");
    const deleteModal = document.getElementById("deleteConfirmationModal");
    const confirmDeleteButton = document.getElementById("confirmDelete");
    const cancelDeleteButton = document.getElementById("cancelDelete");

    deleteButton.addEventListener("click", function() {
        deleteModal.style.display = "block";
    });

    confirmDeleteButton.addEventListener("click", function() {
        // Retrieve the book ID from the URL parameters
        const bookId = getUrlParameter('bookId');

        if (!bookId) {
            alert("Failed to get book ID.");
            return;
        }

        fetch(`http://localhost:8080/api/book/delete/${bookId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to delete book.");
            }
            // Check if the response is JSON
            if (response.headers.get("content-type").includes("application/json")) {
                return response.json();
            } else {
                return response.text(); // If not JSON, return text
            }
        })
        .then(data => {
            if (typeof data === "string") {
                alert(data); // Display the text response
            } else {
                alert(data.message); // Display the JSON response
            }
            // Redirect to admin.html after successful deletion
            window.location.href = "admin-allbook.html";
        })
        .catch(error => {
            console.error("Error:", error.message);
            alert("Failed to delete book.");
        });

        deleteModal.style.display = "none";
    });

    cancelDeleteButton.addEventListener("click", function() {
        deleteModal.style.display = "none";
    });
});
