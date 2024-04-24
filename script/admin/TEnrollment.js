
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




//DROPDOWN
fetch('/courseOption')
    .then(response => response.json())
    .then(data => {
        const selectElement = document.getElementById('CboCourse');
        data.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            selectElement.appendChild(optionElement);
        });
    })
    .catch(error => console.error('Error fetching credit units:', error));


function toggleEntryOption() {
    var entry = document.getElementById("entry");
    var strandOptions = document.getElementById("strandOptions");
    var courseOptions = document.getElementById("courseOptions");
    if (entry.value === "New Student") {
        strandOptions.style.display = "block",
            courseOptions.style.display = "block";
    } else if (entry.value === "Transferee") {
        strandOptions.style.display = "none";
        courseOptions.style.display = "block";
    } else if (entry.value === "2nd Courser") {
        strandOptions.style.display = "none";
        courseOptions.style.display = "block";
    } else {
        strandOptions.style.display = "none";
        courseOptions.style.display = "none";
    }
}



function fetchEnroll() {

    const searchTerm = document.getElementById("search").value;

    fetch(`/searchEnroll?search=${searchTerm}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById("table").innerHTML = data;
        })
        .catch(error => console.error('Error fetching schedule:', error));
}

window.onbeforeunload = fetchEnroll;




//SEARCH NEW STUDENTS
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchStudents');
    const submitBtn = document.getElementById('submitBTN');
    const lrnInput = document.getElementById('lrn');
    const lnameInput = document.getElementById('lname');
    const fnameInput = document.getElementById('fname');
    const mnameInput = document.getElementById('mname');

    submitBtn.addEventListener('click', () => {
        const lrn = searchInput.value;

        fetch(`/searchRegister?searchStudents=${lrn}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Student not found');
                }
                return response.json();
            })
            .then(student => {

                lrnInput.value = student.lrn;
                lnameInput.value = student.lname;
                fnameInput.value = student.fname;
                mnameInput.value = student.mname;

            })
            .catch(error => {
                console.error('Error:', error);

            });
    });
});



function generateNumbers() {
    // Get current year
    var currentYear = new Date().getFullYear().toString();
    // Generate the number with current year and consecutive digits
    var generatedNumber = currentYear;
    for (var i = 1; i <= 5; i++) {
        generatedNumber += i.toString();
    }
    // Update the input field with the generated number
    document.getElementById("snumber").value = generatedNumber;
}









