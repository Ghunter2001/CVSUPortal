const body = document.querySelector("body"),
    modeToggle = body.querySelector(".mode-toggle");
sidebar = body.querySelector("nav");
sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
    body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") {
    sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    if (body.classList.contains("dark")) {
        localStorage.setItem("mode", "dark");
    } else {
        localStorage.setItem("mode", "light");
    }
});

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if (sidebar.classList.contains("close")) {
        localStorage.setItem("status", "close");
    } else {
        localStorage.setItem("status", "open");
    }
})

// Make an AJAX request to fetch the count results from the server
var votedCounts = new XMLHttpRequest();
votedCounts.open('GET', '/countResults', true);
votedCounts.onreadystatechange = function () {
  if (votedCounts.readyState === 4 && votedCounts.status === 200) {
    // Update the count in the HTML content
    document.getElementById('votedCount').textContent = votedCounts.responseText;
  }
};
votedCounts.send();

// Make an AJAX request to fetch the count of voted records from the server
var usersCounts = new XMLHttpRequest();
usersCounts.open('GET', '/countUsers', true);
usersCounts.onreadystatechange = function () {
  if (usersCounts.readyState === 4 && usersCounts.status === 200) {
    // Update the count in the HTML content
    document.getElementById('usersCount').textContent = usersCounts.responseText;
  }
};
usersCounts.send();

// Make an AJAX request to fetch the count of pending records from the server
var candidatesCounts = new XMLHttpRequest();
candidatesCounts.open('GET', '/countCandidates', true);
candidatesCounts.onreadystatechange = function () {
  if (candidatesCounts.readyState === 4 && candidatesCounts.status === 200) {
    // Update the count in the HTML content
    document.getElementById('candidatesCount').textContent = candidatesCounts.responseText;
  }
};
candidatesCounts.send();