document.getElementById("submitBTN").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission

    var TXTAyFrom = document.getElementById("TXTAyFrom").value.trim();
    var TXTAyTo = document.getElementById("TXTAyTo").value.trim();
    var CboSem = document.getElementById("CboSem").value.trim();

    var isValid = true;
    if (TXTAyFrom === "") {
        isValid = false;
    }
    if (TXTAyTo === "") {
        isValid = false;
    }
    if (CboSem === "") {
        isValid = false;
    }


    // Submit the form if valid
    if (isValid) {
        document.getElementById("acadyear").submit();
    } else {
        alert("Please fill out all required fields.");
    }
});




//FOR DELETION
function deleteRow(aycode) {
    if (confirm("Are you sure you want to delete this row?")) {
        fetch('/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ aycode }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log('Row deleted successfully');
                window.location.href = "/acadyear"
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle errors
            });
    }
}

//FOR UPDATE
function updateStatus(aycode) {
    if (confirm("Are you sure you want to select this year?")) {
        fetch('/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ aycode }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log('Row deleted successfully');
                window.location.href = "/acadyear"
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle errors
            });
    }
}





// Get the select element
var fromDropdown = document.getElementById("TXTAyFrom");
var toInput = document.getElementById("TXTAyTo");

// Function to populate the "From" dropdown
function populateFromYears() {
    var startYear = 1990;
    var endYear = 3000;

    for (var year = startYear; year <= endYear; year++) {
        var option = document.createElement("option");
        option.text = year;
        option.value = year;
        fromDropdown.appendChild(option);
    }
}

// Call the function to populate the "From" dropdown
populateFromYears();

// Add event listener to "From" dropdown
fromDropdown.addEventListener("change", function() {
    var selectedYear = parseInt(fromDropdown.value);
    
    if (!isNaN(selectedYear)) {
        toInput.value = selectedYear + 1;
    } else {
        toInput.value = "";
    }
});