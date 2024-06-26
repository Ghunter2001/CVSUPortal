document.getElementById("submitBTN").addEventListener("click", function (event) {
    event.preventDefault();

    var lrn = document.getElementById("lrn").value.trim();
    var lname = document.getElementById("lname").value.trim();
    var fname = document.getElementById("fname").value.trim();
    var mname = document.getElementById("mname").value.trim();
    var cp = document.getElementById("cp").value.trim();
    var sex = document.getElementById("sex").value.trim();
    var bdate = document.getElementById("bdate").value.trim();
    var email = document.getElementById("email").value.trim();
    var address = document.getElementById("address").value.trim();

    var isValid = true;
    if (lrn === "") {
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
    if (cp === "") {
        isValid = false;
    }
    if (sex === "") {
        isValid = false;
    }
    if (bdate === "") {
        isValid = false;
    }
    if (email === "") {
        isValid = false;
    }
    if (address === "") {
        isValid = false;
    }


    // Submit the form if valid
    if (isValid) {
        document.getElementById("addStudentForm").submit();
    } else {
        alert("Please fill out all required fields.");
    }
});




//FOR Archiviing
function archiveRow(lrn) {
    if (confirm("Are you sure you want to archive this row?")) {
        fetch('/archive', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lrn }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log('Row Store successfully');
                window.location.href = "/students"
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}






var lrn = document.getElementById("lrn").value.trim();
var lname = document.getElementById("lname").value.trim();
var fname = document.getElementById("fname").value.trim();
var mname = document.getElementById("mname").value.trim();
var cp = document.getElementById("cp").value.trim();
var sex = document.getElementById("sex").value.trim();
var bdate = document.getElementById("bdate").value.trim();
var email = document.getElementById("email").value.trim();
var address = document.getElementById("address").value.trim();




//UPDATE
function editStudent(lrn) {
    // Assuming you have a form with id "courseForm"
    const form = document.getElementById('addStudentForm');

    // Fetch the course details using AJAX or fetch API
    fetch(`/students/${lrn}`)
        .then(response => response.json())
        .then(addStudentForm => {
            // Populate the form fields with course data
            form.elements['lrn'].value = addStudentForm.lrn;
            form.elements['lname'].value = addStudentForm.lname;
            form.elements['fname'].value = addStudentForm.fname;
            form.elements['mname'].value = addStudentForm.mname;
            form.elements['cp'].value = addStudentForm.cp;
            form.elements['sex'].value = addStudentForm.Sex;
            form.elements['bdate'].value = addStudentForm.bdate;
            form.elements['email'].value = addStudentForm.email;
            form.elements['address'].value = addStudentForm.address;


            // Change the form action to updateCourseForm endpoint
            form.action = '/updateStudentForm';
        })
        .catch(error => console.error('Error:', error));
}