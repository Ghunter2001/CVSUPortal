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
    event.preventDefault();

    const template = document.getElementById('template').value;
    const adviser = document.getElementById('adviser').value;
    const subject = document.getElementById('subject').value;
    const timeIn = document.getElementById('timeIn').value;
    const timeOut = document.getElementById('timeOut').value;

    if (template !== "" && adviser !== "" && subject !== "" && timeIn !== "" && timeOut !== "") {
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
                    window.location.href = "/schedule";
                } else {
                    console.error('Failed to add new Sched Template');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } else {
        alert("Please input details");
        console.log("Input Details are incomplete");
    }
});







document.addEventListener('DOMContentLoaded', function () {
    const submitBtn = document.getElementById('submit');

    submitBtn.addEventListener('click', async function (event) {
        event.preventDefault();

        const acadyear = document.getElementById('acadyear').value;
        const tempCreated = document.getElementById('tempCreated').value;
        const advisory = document.getElementById('advisory').value;
        const selectedDays = Array.from(document.querySelectorAll('input[name="days"]:checked')).map(input => input.value);

        if (acadyear !== "" && tempCreated !== "" && advisory !== "" && selectedDays.length > 0) {
            try {
                const response = await fetch('/addSched', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ acadyear, tempCreated, days: selectedDays, advisory })
                });

                if (response.ok) {
                    console.log('Schedule added successfully');
                    window.location.href = "/schedule";
                } else {
                    console.error('Failed to add schedule');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            alert("Please input details");
            console.log("Input Details are incomplete");
        }
    });
});






function deleteSCHED(tempName) {

    if (confirm("Are you sure you want to delete this row?")) {
        fetch('/deleteSCHEDS', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tempName }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log('Row deleted successfully');
                window.location.href = "/schedule"
            })
            .catch(error => {
                console.error('Error:', error);

            });
    }
}