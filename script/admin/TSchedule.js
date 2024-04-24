//DROPDOWN
fetch('/adviserOption')
    .then(response => response.json())
    .then(data => {
        const selectElement = document.getElementById('adviser');
        data.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            selectElement.appendChild(optionElement);
        });
    })
    .catch(error => console.error('Error fetching credit units:', error));


fetch('/subjectOption')
    .then(response => response.json())
    .then(data => {
        const selectElement = document.getElementById('subject');
        data.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            selectElement.appendChild(optionElement);
        });
    })
    .catch(error => console.error('Error fetching credit units:', error));


fetch('/acadOption')
    .then(response => response.json())
    .then(data => {
        const selectElement = document.getElementById('acadyear');
        data.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            selectElement.appendChild(optionElement);
        });
    })
    .catch(error => console.error('Error fetching credit units:', error));


fetch('/tempOption')
    .then(response => response.json())
    .then(data => {
        const selectElement = document.getElementById('tempCreated');
        data.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            selectElement.appendChild(optionElement);
        });
    })
    .catch(error => console.error('Error fetching credit units:', error));

fetch('/advisoryOption')
    .then(response => response.json())
    .then(data => {
        const selectElement = document.getElementById('advisory');
        data.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            selectElement.appendChild(optionElement);
        });
    })
    .catch(error => console.error('Error fetching credit units:', error));







document.getElementById('submitbtn').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const template = document.getElementById('template').value;
    const adviser = document.getElementById('adviser').value;
    const subject = document.getElementById('subject').value;
    const timeIn = document.getElementById('timeIn').value;
    const timeOut = document.getElementById('timeOut').value;

    // Check if required fields are not empty
    if (template !== "" && adviser !== "" && subject !== "" && timeIn !== "" && timeOut !== "") {
        // Send the data to the server
        fetch('/addSchedTemplate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ template, adviser, subject, timeIn, timeOut })
        })
            .then(response => {
                if (response.ok) {
                    console.log('New Sched Template Added.');
                    // Redirect or perform any other action upon successful addition
                    window.location.href = "/schedule";
                } else {
                    console.error('Failed to add new Sched Template');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } else {
        console.log("Input Details are incomplete");
    }
});








document.getElementById('submitBTN').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const acadyear = document.getElementById('acadyear').value;
    const tempCreated = document.getElementById('tempCreated').value;
    const advisory = document.getElementById('advisory').value; // Fix: Retrieve advisory value

    const formData = new FormData(document.getElementById('checkboxForm'));
    const selectedDays = Array.from(formData.getAll('days')); // Convert NodeList to Array

    // Check if required fields are not empty
    if (acadyear !== "" && tempCreated !== "" && advisory !== "") { // Fix: Use && instead of || for validation
        // Send the data to the server
        fetch('/addSched', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ acadyear, tempCreated, days: selectedDays, advisory, })
        })
            .then(response => {
                if (response.ok) {
                    console.log('Schedule added successfully');
                    // Redirect or perform any other action upon successful addition
                } else {
                    console.error('Failed to add schedule');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } else {
        console.log("Input Details are incomplete");
    }
});
