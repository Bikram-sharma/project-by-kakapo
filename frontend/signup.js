const form = document.getElementById("signupForm");

function signup(e) {
  e.preventDefault();
  const formData = new FormData(form);
  const body = Object.fromEntries(formData);

  axios
    .post("http://localhost:3000/signup", body)
    .then((response) => {
      if (response.status === 201) {
        window.location.href = "login.html";
      }
    })
    .catch((error) => {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.error);
      } else {
        console.error("Server Error", error);
      }
    });
}

form.addEventListener("submit", (e) => signup(e));
