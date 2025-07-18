const form = document.getElementById("loginForm");
const toggleIcon = document.getElementById("passwordIcon");
const passwordInput = document.getElementById("password");
const logInButton = document.getElementById("login");

if (sessionStorage.getItem("user")) {
  window.location.href = "./deskbod.html";
}

function login(e) {
  e.preventDefault();
  const formData = new FormData(form);
  const body = Object.fromEntries(formData);

  axios
    .post("http://localhost:3000/login", body)
    .then((response) => {
      if (response.status === 200) {
        sessionStorage.setItem("user", response.data.username);
        Toastify({
          text: "Logged in successfully!",
          duration: 2000,
          gravity: "top", // top or bottom
          position: "center", // left, center or right
          backgroundColor: "green",
        }).showToast();
        setTimeout(() => (window.location.href = "./deskbod.html"), 1000);
      } else {
        console.error("Login Failed", response.status);
      }
    })
    .catch((error) => {
      const errorMsg = error.response?.data?.error || "Server error";

      Toastify({
        text: errorMsg,
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "red",
      }).showToast();

      console.error("Server Error", error);
    });
}

form.addEventListener("submit", (e) => login(e));

toggleIcon.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  toggleIcon.classList.toggle("fa-eye");
});
