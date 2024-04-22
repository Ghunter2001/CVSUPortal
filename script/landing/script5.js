document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  const pwShowHide = document.querySelectorAll(".showHidePw");
  const pwFields = document.querySelectorAll(".password");
  const signUp = document.querySelector(".signup-link");
  const login = document.querySelector(".login-link");

  // Code to show/hide password and change icon
  pwShowHide.forEach((eyeIcon) => {
    eyeIcon.addEventListener("click", () => {
      pwFields.forEach((pwField) => {
        if (pwField.type === "password") {
          pwField.type = "text";
          pwShowHide.forEach((icon) => {
            if (icon.classList.contains("uil-eye-slash")) {
              icon.classList.replace("uil-eye-slash", "uil-eye");
            }
          });
        } else {
          pwField.type = "password";
          pwShowHide.forEach((icon) => {
            if (icon.classList.contains("uil-eye")) {
              icon.classList.replace("uil-eye", "uil-eye-slash");
            }
          });
        }
      });
    });
  });

  // Code to toggle between signup and login form
  if (signUp && login) {
    signUp.addEventListener("click", () => {
      container.classList.add("active");
    });

    login.addEventListener("click", () => {
      container.classList.remove("active");
    });
  }
});

/*const container = document.querySelector(".container");
const pwShowHide = document.querySelectorAll(".showHidePassword");
const pwFields = document.querySelectorAll(".input-field input[type='password']");
const signUp = document.querySelector(".signUp-link a");
const login = document.querySelector(".form-wrapper h2");

// Code to show/hide password and change icon
pwShowHide.forEach((eyeIcon) => {
  eyeIcon.addEventListener("click", () => {
    pwFields.forEach((pwField) => {
      if (pwField.type === "password") {
        pwField.type = "text";
        pwShowHide.forEach((icon) => {
          icon.classList.replace("fa-regular", "fas");
          icon.classList.replace("fa-eye-slash", "fa-eye");
        });
      } else {
        pwField.type = "password";
        pwShowHide.forEach((icon) => {
          icon.classList.replace("fa-regular", "fas");
          icon.classList.replace("fa-eye", "fa-eye-slash");
        });
      }
    });
  });
});

// Code to toggle between signup and login form
signUp.addEventListener("click", (event) => {
  event.preventDefault();
  container.classList.add("active");
});

login.addEventListener("click", (event) => {
  event.preventDefault();
  container.classList.remove("active");
});



/*const container = document.querySelector(".container"),
pwShowHide = document.querySelectorAll(".showHidePw"),
pwFields = document.querySelectorAll(".password"),
signUp = document.querySelector(".signup-link"),
login = document.querySelector(".login-link");
//   js code to show/hide password and change icon
pwShowHide.forEach(eyeIcon =>{
  eyeIcon.addEventListener("click", ()=>{
      pwFields.forEach(pwField =>{
          if(pwField.type ==="password"){
              pwField.type = "text";
              pwShowHide.forEach(icon =>{
                  icon.classList.replace("uil-eye-slash", "uil-eye");
              })
          }else{
              pwField.type = "password";
              pwShowHide.forEach(icon =>{
                  icon.classList.replace("uil-eye", "uil-eye-slash");
              })
          }
      }) 
  })
})
// js code to appear signup and login form
signUp.addEventListener("click", ( )=>{
  container.classList.add("active");
});
login.addEventListener("click", ( )=>{
  container.classList.remove("active");
});*/