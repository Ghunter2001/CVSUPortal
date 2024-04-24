
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

// Fetch schedule on page load
window.onbeforeunload = fetchEnroll;










function updateDateTime() {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();

    const weekdayElement = document.getElementById('weekday');
    const dateElement = document.getElementById('date');

    const weekday = daysOfWeek[currentDate.getDay()];
    const month = months[currentDate.getMonth()];
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();

    const formattedDate = month + ' ' + day + ', ' + year;

    weekdayElement.textContent = weekday;
    dateElement.textContent = formattedDate;
}

// Update time initially
updateDateTime();

// Update time every second
setInterval(updateDateTime, 1000);



