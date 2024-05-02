document.getElementById("submitBTN").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission

    var courseCode = document.getElementById("courseCode").value.trim();
    var description = document.getElementById("courseDesc").value.trim();

    var isValid = true;
    if (courseCode === "") {
        isValid = false;
    }
    if (description === "") {
        isValid = false;
    }


    // Submit the form if valid
    if (isValid) {
        var courseCode = document.getElementById("courseCode");
        var courseDesc = document.getElementById("courseDesc");
        courseCode.value = courseCode.value.toLowerCase().replace(/\w/g, function (char) {
            return char.toUpperCase();
        });

        courseDesc.value = courseDesc.value.toLowerCase().replace(/\b\w/g, function (char) {
            return char.toUpperCase();
        });
        document.getElementById("course").submit();
    } else {
        alert("Please fill out all required fields.");
    }
});






//FOR DELETION
function deleteRow(courseCode) {
    // Ask for confirmation
    if (confirm("Are you sure you want to delete this row?")) {
        fetch('/deleteCourse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ courseCode }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log('Row deleted successfully');
                window.location.href = "/courses"
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle errors
            });
    }
}







function editCourse(courseCode) {
    // Assuming you have a form with id "courseForm"
    const form = document.getElementById('course');

    // Fetch the course details using AJAX or fetch API
    fetch(`/courses/${courseCode}`)
        .then(response => response.json())
        .then(course => {
            // Populate the form fields with course data
            form.elements['courseCode'].value = course.courseCode;
            form.elements['courseDesc'].value = course.description;

            // Change the form action to updateCourseForm endpoint
            form.action = '/updateCourseForm';
        })
        .catch(error => console.error('Error:', error));
}