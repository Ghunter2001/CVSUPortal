document.getElementById("submitBTN").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission

    var CboYear = document.getElementById("CboYear").value.trim();
    var CboSem = document.getElementById("CboSem").value.trim();
    var CboSec = document.getElementById("CboSec").value.trim();

    var isValid = true;
    if (CboYear === "") {
        isValid = false;
    }
    if (CboSem === "") {
        isValid = false;
    }
    if (CboSec === "") {
        isValid = false;
    }


    // Submit the form if valid
    if (isValid) {
        document.getElementById("section").submit();
    } else {
        alert("Please fill out all required fields.");
    }
});




//FOR DELETION
function deleteRow(secID) {
    // Ask for confirmation
    if (confirm("Are you sure you want to delete this row?")) {
        fetch('/deleteSec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ secID }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log('Row deleted successfully');
                window.location.href = "/sections"
            })
            .catch(error => {
                console.error('Error:', error);

            });
    }
}