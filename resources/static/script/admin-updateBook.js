function getUrlParameter(name) {
  name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

document.addEventListener('DOMContentLoaded', function() {
  const updateButton = document.querySelector('.update-button');

  updateButton.addEventListener('click', function(event) {
    event.preventDefault();

    // Get the book ID from the URL
    const bookId = getUrlParameter('bookId');

    // Send a PUT request to update the book status
    fetch(`/api/book/${bookId}/make-available`, {
      method: 'PUT'
    })
    .then(response => {
      if (response.ok) {
        return response.text();
      } else {
        // If there's an error, log it to the console
        console.error('Failed to update book status');
      }
    })
    .then(data => {
      // Display the response message
      alert(data);
      // Reload the page after successful update
      window.location.reload();
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
});
