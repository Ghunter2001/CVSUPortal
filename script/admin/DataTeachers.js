document.getElementById("datateachersForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const output = document.getElementById("output").value;
    const fname = document.getElementById("fname").value;
    const mname = document.getElementById("mname").value;
    const lname = document.getElementById("lname").value;
    const bdate = document.getElementById("bdate").value;
    const sex = document.getElementById("sex").value;
    const cp = document.getElementById("cp").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;



    fetch("/adTeachersForm", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ output, fname, mname, lname, bdate, sex, cp, email, address })
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

