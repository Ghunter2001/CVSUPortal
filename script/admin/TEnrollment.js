
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





document.addEventListener("DOMContentLoaded", function() {
    var modal = document.getElementById("myModal");
    var newButton = document.getElementById("newButton");
    var cancelButton = document.getElementById("cancelButton");
    var closeButton = document.querySelector(".close");

    newButton.addEventListener("click", function() {
        modal.style.display = "block";
    });

    cancelButton.addEventListener("click", function() {
        modal.style.display = "none";
    });

    closeButton.addEventListener("click", function() {
        modal.style.display = "none";
    });
});
