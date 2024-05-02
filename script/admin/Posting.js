
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

//DROPDOWN
fetch('/pCourseOption')
  .then(response => response.json())
  .then(data => {
    const selectElement = document.getElementById('pCourse');
    data.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.text;
      selectElement.appendChild(optionElement);
    });
  })
  .catch(error => console.error('Error fetching credit units:', error));

fetch('/prereqOption')
  .then(response => response.json())
  .then(data => {
    const selectElement = document.getElementById('prereq');
    data.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.text;
      selectElement.appendChild(optionElement);
    });
  })
  .catch(error => console.error('Error fetching credit units:', error));

function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

//FOR DELETION
function deleteRow(NoticeTitle) {
    // Ask for confirmation
    if (confirm("Are you sure you want to delete this row?")) {
        fetch('/NoticeDelete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ NoticeTitle }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log('Row deleted successfully');
                window.location.href = "/notice"
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle errors
            });
    }
}

// document.getElementById("submitBTN").addEventListener("click", function (event) {
//     event.preventDefault(); // Prevent form submission

//     var pType = document.getElementById("pType").value.trim();
//     var pDate = document.getElementById("pDate").value.trim();
//     var pTime = document.getElementById("pTime").value.trim();
//     var pTitle = document.getElementById("pTitle").value.trim();
//     var pDesc = document.getElementById("pDesc").value.trim();
//     var pCourse = document.getElementById("pCourse").value.trim();

//     var isValid = true;
//     if (pType === "") {
//       isValid = false;
//     }
//     if (pDate === "") {
//       isValid = false;
//     }
//     if (pTime === "") {
//       isValid = false;
//     }
//     if (pTitle === "") {
//       isValid = false;
//     }
//     if (pDesc === "") {
//       isValid = false;
//     }
//     if (pCourse === "") {
//       isValid = false;
//     }

//     // Submit the form if valid
//     if (isValid) {

//       document.getElementById("postform").submit();
//     } else {
//       alert("Please fill out all required fields.");
//     }
//   });
  







