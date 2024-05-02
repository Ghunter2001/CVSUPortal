document.getElementById("datateachersForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const output = document.getElementById("output").value;
    const fname = document.getElementById("fname").value;
    const mname = document.getElementById("mname").value;
    const lname = document.getElementById("lname").value;
    const email = document.getElementById("email").value;



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
            // Handle response here, e.g., show success message and redirect

        })
        .catch(error => {
            console.error("Error:", error);
            // Handle error here, e.g., show error message
            alert("An error occurred. Please try again.");
        });
});



//FOR DELETION
function archiveTeacher(id) {
    if (confirm("Are you sure you want to archive this row?")) {
        fetch('/archiveTeacher', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
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



function generateNumbers() {

    var currentYear = new Date().getFullYear().toString();
 
    var generatedNumber = currentYear;
    for (var i = 1; i <= 5; i++) {
        generatedNumber += i.toString();
    }

    document.getElementById("output").value = generatedNumber;
}