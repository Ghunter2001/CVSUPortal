const body = document.querySelector("body"),
    sidebar = body.querySelector("nav"),
    sidebarToggle = body.querySelector(".sidebar-toggle");

let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") {
    sidebar.classList.toggle("close");
}


sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if (sidebar.classList.contains("close")) {
        localStorage.setItem("status", "close");
    } else {
        localStorage.setItem("status", "open");
    }
});



fetch('/session')
    .then(response => response.json())
    .then(data => {
        document.getElementById('sessionName').innerText = data.sessionName;
        document.getElementById('sessionNumber').innerText = data.sessionNumber;
    })
    .catch(error => console.error('Error fetching session data:', error));