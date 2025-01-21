document.addEventListener("DOMContentLoaded", function() {

    var cancelButton = document.querySelector('.cancel-button');


    cancelButton.addEventListener('click', function() {
                        console.log("Cancel button clicked!");
                        window.location.href = 'home1.html';
    });


});
