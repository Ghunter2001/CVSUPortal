document.getElementById("datateachersForm").addEventListener("submit", function (event) {
    event.preventDefault();
    

    const output = document.getElementById("output").value.trim();
    const fname = document.getElementById("fname").value.trim();
    const mname = document.getElementById("mname").value.trim();
    const lname = document.getElementById("lname").value.trim();
    const email = document.getElementById("email").value.trim();

    var isValid = true;
    if (output === "") {
        isValid = false;
    }
    if (fname === "") {
        isValid = false;
    }
    if (mname === "") {
        isValid = false;
    }
    if (mname === "") {
        isValid = false;
    }
    if (lname === "") {
        isValid = false;
    }
    if (email === "") {
        isValid = false;
    }

    // Submit the form if valid
    if (isValid) {

        fetch("/addTeachersForm", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ output, fname, mname, lname, email })
    })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            window.location.href = "/teachers"

        })
        .catch(error => {
            console.error("Error:", error);
            // Handle error here, e.g., show error message
            alert("An error occurred. Please try again.");
        });
    } else {
        alert("Please fill out all required fields.");
    }

    
});



//FOR DELETION
function archiveTeacher(teacherID) {
    if (confirm("Are you sure you want to archive this row?")) {
        fetch('/archiveTeacher', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ teacherID }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log('Row Store successfully');
                window.location.href = "/teachers"
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}



// function generateNumbers() {

//     var currentYear = new Date().getFullYear().toString();

//     var generatedNumber = currentYear;
//     for (var i = 1; i <= 5; i++) {
//         generatedNumber += i.toString();
//     }

//     document.getElementById("output").value = generatedNumber;
// }