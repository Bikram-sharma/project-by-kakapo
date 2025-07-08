const form = document.getElementById("signupForm");
const toggleIcon= document.getElementById("passwordIcon");
const passwordInput = document.getElementById("password");


function signup(e) {
  e.preventDefault();
  const formData = new FormData(form);
  const body = Object.fromEntries(formData);

  const validEmail = validator.isEmail(body.email.trim());
  const validPassword = validator.isStrongPassword(body.password.trim(), {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });

  if (!validEmail || !validPassword) {
    let message = !validEmail
      ? "Invalid email address"
      : "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a symbol.";

    Toastify({
      text: message,
      duration: 3000,
      gravity: "top", // top or bottom
      position: "center", // left, center or right
      backgroundColor: "red",
    }).showToast();

    return;
  }

  axios
    .post("http://localhost:3000/signup", body)
    .then((response) => {
      if (response.status === 201) {
        
        Toastify({
          text: " Signed up successfully!",
          duration: 2000,
          gravity: "top", // top or bottom
          position: "center", // left, center or right
          backgroundColor: "green",
        }).showToast();
        setTimeout(() => (window.location.href = "./login.html"), 1000);
        
      }
    })
    .catch((error) => {
      if (error.response && error.response.status === 400) {
        Toastify({
          text: error.response.data.error,
          duration: 3000,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
      } else {
        console.error("Server Error", error);
      }
    });
}

form.addEventListener("submit", (e) => signup(e));

toggleIcon.addEventListener("click",()=>{
  const ispassword = passwordInput.type === "password"
  passwordInput.type = ispassword ? "text" : "password";
  toggleIcon.classList.toggle("fa-eye");
});
 
