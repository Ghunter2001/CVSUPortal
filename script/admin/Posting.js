document.addEventListener("DOMContentLoaded", function () {
  var modal = document.getElementById("myModal");
  var newButton = document.getElementById("newButton");
  var cancelButton = document.querySelector(".close"); // Selecting the close button for cancel action

  // Function to populate course options dropdown
  function populateCourseOptions() {
      fetch('/pCourseOption')
          .then(response => response.json())
          .then(data => {
              const selectElement = document.getElementById('pCourse');
              selectElement.innerHTML = ''; // Clear existing options
              data.forEach(option => {
                  const optionElement = document.createElement('option');
                  optionElement.value = option.value;
                  optionElement.textContent = option.text;
                  selectElement.appendChild(optionElement);
              });
          })
          .catch(error => console.error('Error fetching course options:', error));
  }

  // Call the function to populate course options dropdown initially
  populateCourseOptions();

  newButton.addEventListener("click", function () {
      modal.style.display = "block";
      // Change button to submit
      var submitBtn = document.getElementById("submitBTN");
      submitBtn.innerText = "Submit";
      submitBtn.type = "submit";

      // Populate course options dropdown every time the modal is opened
      populateCourseOptions();
  });

  cancelButton.addEventListener("click", function () {
      modal.style.display = "none";
  });

  // Event listener for update icon
  document.addEventListener('click', function (event) {
      if (event.target && event.target.classList.contains('edit-button')) {
          var editBtn = event.target;
          var modal = document.getElementById("myModal");

          // Populate form with data
          var titleInput = document.getElementById("pTitle");
          var contentInput = document.getElementById("pDesc");
          var courseIdInput = document.getElementById("pCourse");
          var postedDateInput = document.getElementById("pDate");
          var timePostedInput = document.getElementById("pTime");
          var noticeTypeInput = document.getElementById("pType");

          titleInput.value = editBtn.dataset.noticeTitle;
          contentInput.value = editBtn.dataset.noticeContent;
          courseIdInput.value = editBtn.dataset.courseId;
          postedDateInput.value = editBtn.dataset.postedDate;
          timePostedInput.value = editBtn.dataset.timePosted;
          noticeTypeInput.value = editBtn.dataset.noticeType;

          // Change button to update
          var submitBtn = document.getElementById("submitBTN");
          submitBtn.innerText = "Update";
          submitBtn.type = "button";

          // Open modal
          modal.style.display = "block";
      }
  });

  // Event listener for submit/update button
  var submitBtn = document.getElementById("submitBTN");
  submitBtn.addEventListener("click", function () {
      var action = this.innerText.toLowerCase(); // Get the action type (submit or update)
      var form = document.getElementById("postform");
      if (action === "update") {
          var formData = new FormData(form);
          var noticeTitle = formData.get("pTitle");
          var noticeContent = formData.get("pDesc");
          var courseId = formData.get("pCourse");
          var postedDate = formData.get("pDate");
          var timePosted = formData.get("pTime");
          var noticeType = formData.get("pType");

          // Perform fetch request to update data
          fetch('/NoticeEdit', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  NoticeTitle: noticeTitle,
                  NoticeContent: noticeContent,
                  CourseID: courseId,
                  PostedDate: postedDate,
                  TimePosted: timePosted,
                  NoticeType: noticeType
              }),
          })
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              console.log('Row updated successfully');
              modal.style.display = "none"; // Close modal after successful edit
              window.location.href = "/notice"; // Refresh page or update data as needed
          })
          .catch(error => {
              console.error('Error:', error);
              // Handle errors
          });
      } else {
          form.dispatchEvent(new Event("submit")); // Trigger the form submission event
      }
  });

});

// Function to delete row
function deleteRow(pTitle) {
  // Ask for confirmation
  if (confirm("Are you sure you want to delete this row?")) {
      fetch('/NoticeDelete', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pTitle }),
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

// Function to populate course options dropdown
function populateCourseOptions() {
    fetch('/pCourseOption')
      .then(response => response.json())
      .then(data => {
        const selectElement = document.getElementById('pCourse');
        selectElement.innerHTML = ''; // Clear existing options
        data.forEach(option => {
          const optionElement = document.createElement('option');
          optionElement.value = option.value;
          optionElement.textContent = option.text;
          selectElement.appendChild(optionElement);
        });
      })
      .catch(error => console.error('Error fetching course options:', error));
}