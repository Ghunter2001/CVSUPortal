//SIGN UP VALIDATION
document.getElementById("submitButton").addEventListener("click", function (event) {
	event.preventDefault(); // Prevent form submission
  
	// Get form values
	var username = document.getElementById("user").value;
	var course = document.getElementById("course").value;
	var email = document.getElementById("email").value;
	var password = document.getElementById("pass").value;
	var cpass = document.getElementById("confirm-password").value;
  
	// Validate form fields
	var isValid = true;
	if (username.trim() === "") {
	  isValid = false;
	}
	if (course.trim() === "") {
	  isValid = false;
	}
	if (email.trim() === "") {
	  isValid = false;
	}
	if (password.trim() === "") {
	  isValid = false;
	}
	if (cpass.trim() === "") {
	  isValid = false;
	}
  
	// Submit the form if valid
	if (isValid) {
	  document.getElementById("register-form").submit();
	}else {
	  res.send(`
			  <script>
				alert("Signup successful!");
				window.location.href = "/login.html"; // Redirect to the login page after successful sign-up
			  </script>
			`);
	}
  });
  
  
  //login form validation
  function validateLoginForm(event) {
	event.preventDefault(); // Prevent form submission
  
	// Clear previous error messages
	const usernameError = document.getElementById("usernameError");
	const passwordError = document.getElementById("passwordError");
	usernameError.textContent = "";
	passwordError.textContent = "";
  
	// Get form inputs
	const username = document.getElementById("username").value.trim();
	const pass = document.getElementById("password").value.trim();
  
	// Perform validation
	let isValid = true;
	if (username === "") {
	  usernameError.textContent = "Please enter a username.";
	  isValid = false;
	}
  
	if (pass === "") {
	  passwordError.textContent = "Please enter a password.";
	  isValid = false;
	}
  
	// Submit the form if valid
	if (isValid) {
	  document.getElementById("sign-in").submit();
	}
  }
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  
  if (error === '1') {
	alert("INVALID DATA");
  }
  