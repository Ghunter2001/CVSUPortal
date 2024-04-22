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
})


const dropdowns = document.querySelectorAll(".dropdown");

dropdowns.forEach(dropdown => {
  const dropdownToggle = dropdown.querySelector(".dropbtn");
  const dropdownKey = dropdown.dataset.dropdownKey;

  let dropStatus = localStorage.getItem(dropdownKey + "DropStatus");
  if (dropStatus && dropStatus === "close") {
    dropdown.classList.add("close");
  }

  dropdownToggle.addEventListener("click", () => {
    closeOtherDropdowns(dropdown);
    dropdown.classList.toggle("open");
    const isOpen = dropdown.classList.contains("open");
    localStorage.setItem(dropdownKey + "DropStatus", isOpen ? "open" : "close");
  });
});

function closeOtherDropdowns(clickedDropdown) {
  dropdowns.forEach(dropdown => {
    if (dropdown !== clickedDropdown) {
      dropdown.classList.remove("open");
      const dropdownKey = dropdown.dataset.dropdownKey;
      localStorage.setItem(dropdownKey + "DropStatus", "close");
    }
  });
}

fetch('/sessionAdmin')
  .then(response => response.json())
  .then(data => {
    document.getElementById('sessionName').innerText = data.sessionName;
    document.getElementById('sessionNumber').innerText = data.sessionNumber;
  })
  .catch(error => console.error('Error fetching session data:', error));




