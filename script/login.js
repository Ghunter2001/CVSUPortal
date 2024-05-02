const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

//SIGN UP VALIDATION
document.getElementById("submitButton").addEventListener("click", function (event) {
  event.preventDefault(); // Prevent form submission

  // Get form values
  var fname = document.getElementById("fname").value.trim();
  var lname = document.getElementById("lname").value.trim();
  var mname = document.getElementById("mname").value.trim();
  var bdate = document.getElementById("bdate").value.trim();
  var Sex = document.getElementById("Sex").value.trim();
  var cp = document.getElementById("cp").value.trim();
  var address = document.getElementById("address").value.trim();
  var email = document.getElementById("email").value.trim();
  var password = document.getElementById("password").value.trim();
  var confirmPassword = document.getElementById("confirmPassword").value.trim();

  // Validate form fields
  var isValid = true;
  if (fname === "") {
    isValid = false;
  }
  if (lname === "") {
    isValid = false;
  }
  if (mname === "") {
    isValid = false;
  }
  if (bdate === "") {
    isValid = false;
  }
  if (Sex === "") {
    isValid = false;
  }
  if (cp === "") {
    isValid = false;
  }
  if (address === "") {
    isValid = false;
  }
  if (email === "") {
    isValid = false;
  }
  if (password === "") {
    isValid = false;
  }
  if (confirmPassword === "") {
    isValid = false;
  }
  if (password !== confirmPassword) {
    isValid = false;
    document.getElementById("passwordMatchMessage").textContent = "Passwords do not match";
  } else {
    document.getElementById("passwordMatchMessage").textContent = "";
  }

  // Submit the form if valid
  if (isValid) {
    document.getElementById("sign-up").submit();
  } else {
    alert("Please fill out all required fields and make sure passwords match.");
  }

  if (username && email && password && confirmPassword && password === confirmPassword) {
    showModal('Signup Successful!', true);
  } else {
    showModal('Please fill out all required fields and make sure passwords match', false);
  }
});


Z
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
  const pass = document.getElementById("pass").value.trim();

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






