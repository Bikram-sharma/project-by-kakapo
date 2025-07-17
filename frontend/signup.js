const form = document.getElementById("signupForm");
const toggleIcon = document.getElementById("passwordIcon");
const passwordInput = document.getElementById("password");

if (sessionStorage.getItem("user")) {
  window.location.href = "./deskbod.html";
}

function signup(e) {
  e.preventDefault();
  e.stopPropagation();

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
        console.log(response.data.message);
        window.location.href = "./login.html";
      }
    })
    .catch((error) => {
      if (error.response && error.response.status === 400) {
        console.log(error.response.data.error);
        Toastify({
          text: error.response.data.error,
          duration: 3000,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();
      } else {
        Toastify({
          text: "Server Error",
          duration: 3000,
          gravity: "top",
          position: "center",
          backgroundColor: "red",
        }).showToast();

        console.error("Server Error", error);
      }
    });
}

form.addEventListener("submit", (e) => signup(e));

toggleIcon.addEventListener("click", () => {
  const ispassword = passwordInput.type === "password";
  passwordInput.type = ispassword ? "text" : "password";
  toggleIcon.classList.toggle("fa-eye");
});
