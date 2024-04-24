
document.addEventListener("DOMContentLoaded", function () {
    var modal = document.getElementById("myModal");
    var newButton = document.getElementById("newButton");
    var cancelButton = document.querySelector("close"); // Selecting the close button for cancel action

    newButton.addEventListener("click", function () {
        modal.style.display = "block";
    });

    cancelButton.addEventListener("click", function () {
        modal.style.display = "none";
    });
});



function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

//FOR DELETION
function deleteRow(NoticeTitle) {
    // Ask for confirmation
    if (confirm("Are you sure you want to delete this row?")) {
        fetch('/NoticeDelete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ NoticeTitle }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log('Row deleted successfully');
                window.location.href = "/notice"
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle errors
            });
    }
}









