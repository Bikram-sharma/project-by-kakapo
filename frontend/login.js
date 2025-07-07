const form = document.getElementById("loginForm");

function login(e) {
  e.preventDefault();
  const formData = new FormData(form);
  const body = Object.fromEntries(formData);

  axios
    .post("http://localhost:3000/login", body)
    .then((response) => {
      if (response.status === 200) {
        localStorage.setItem("user", response.data.username);
        window.location.href = "deskbod.html";
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
