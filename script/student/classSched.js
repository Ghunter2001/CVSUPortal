
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


//DROPDOWN MATCHED DAY
function setDayOfWeek() {
    var daysSelect = document.getElementById("days");
    var weekdaySpan = document.getElementById("weekday").textContent.trim();
    
    // Loop through options and find matching text
    for (var i = 0; i < daysSelect.options.length; i++) {
        if (daysSelect.options[i].textContent === weekdaySpan) {
            daysSelect.selectedIndex = i;
            break;
        }
    }
}

setDayOfWeek();






    
function fetchSchedule() {
    // const selectedYearTerm = document.getElementById("sYt").value;

    const selectedDay = document.getElementById("days").value;
    
    fetch(`/classScheds?day=${selectedDay}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById("table").innerHTML = data;
        })
        .catch(error => console.error('Error fetching schedule:', error));
}

// Fetch schedule on page load
window.onload = fetchSchedule;