document.getElementById("entrylabel").style.display = "block ";
document.getElementById("entry").style.display = "block";
document.getElementById("yrlsec").style.display = "none";



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
    document.getElementById("myModal").style.display = "none";
    document.querySelectorAll('.myModal input').forEach(input => input.value = '');
    window.location.href = "enrollment";
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
    if (entry.value === "New") {
        strandOptions.style.display = "block",
            courseOptions.style.display = "block";
    } else if (entry.value === "Regular") {
        strandOptions.style.display = "none";
        courseOptions.style.display = "none";
    } else if (entry.value === "Transferee") {
        strandOptions.style.display = "none";
        courseOptions.style.display = "block";
    } else if (entry.value === "Returnee") {
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




//SEARCH STUDENTS
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchStudents');
    const submit = document.getElementById('submit');
    const lrnInput = document.getElementById('lrn');
    const lnameInput = document.getElementById('lname');
    const fnameInput = document.getElementById('fname');
    const mnameInput = document.getElementById('mname');

    submit.addEventListener('click', () => {
        const value = searchInput.value;

        fetch(`/searchRegister?searchStudents=${value}`)
            .then(response => {
                if (!response.ok) {
                    alert("No Data Found");
                    document.querySelectorAll('.myModal input').forEach(input => input.value = '');
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
    // Generate a random number between 10000 and 99999
    var randomNumber = Math.floor(Math.random() * 90000) + 10000;
    // Combine current year and random number
    var generatedNumber = currentYear + randomNumber.toString();
    // Update the input field with the generated number
    document.getElementById("snumber").value = generatedNumber;
}





document.getElementById("submitBTN").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission

    var snumber = document.getElementById("snumber").value.trim();
    var lname = document.getElementById("lname").value.trim();
    var fname = document.getElementById("fname").value.trim();
    var mname = document.getElementById("mname").value.trim();
    var entry = document.getElementById("entry").value.trim();
    var CboCourse = document.getElementById("CboCourse").value.trim();

    var isValid = true;
    if (snumber === "") {
        isValid = false;
    }
    if (lname === "") {
        isValid = false;
    }
    if (fname === "") {
        isValid = false;
    }
    if (mname === "") {
        isValid = false;
    }
    if (entry === "") {
        isValid = false;
    }
    if (CboCourse === "") {
        isValid = false;
    }


    // Submit the form if valid
    if (isValid) {
        document.getElementById("enroll").submit();
    } else {
        alert("Please fill out all required fields.");
    }
});






//FOR DELETION
function deleteRow(student_number) {
    // Ask for confirmation
    if (confirm("Are you sure you want to remove this row?")) {
        fetch('/deleteEnroll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ student_number }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log('Row deleted successfully');
                window.location.href = "/enrollment"
            })
            .catch(error => {
                console.error('Error:', error);

            });
    }
}








//UPDATE
function editEnroll(student_number) {
    // Assuming you have a form with id "courseForm"
    const form = document.getElementById('enroll');

    document.getElementById("myModal").style.display = "block";

    document.getElementById("yrlsec").style.display = "block";

    document.getElementById("entrylabel").style.display = "none ";
    document.getElementById("entry").style.display = "none";
    document.getElementById("searchbar").style.display = "none";

    // Fetch the course details using AJAX or fetch API
    fetch(`/enrollment/${student_number}`)
        .then(response => response.json())
        .then(enroll => {
            // Populate the form fields with course data
            form.elements['snumber'].value = enroll.student_number;
            form.elements['lname'].value = enroll.lname;
            form.elements['fname'].value = enroll.fname;
            form.elements['mname'].value = enroll.mname;
            form.elements['CboCourse'].value = enroll.course;
            form.elements['yrlvl'].value = enroll.yrlvl;
            
            // Change the form action to updateCourseForm endpoint
            form.action = '/updateEnrollForm';
        })
        .catch(error => console.error('Error:', error));
}