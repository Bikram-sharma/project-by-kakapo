const form = document.getElementById("loginForm");

function login(e){
    e.preventDefault()
    const formData = new FormData(form);
    const body = Object.fromEntries(formData);

    axios.post("https://localhost:3000/login", body)
         .then(response => {
            if(response.status === 200){
                window.location.href = 'deskbod.html';

            } else {
            console.error('Login Failed', response.status);
            }
         })
         .catch(error =>{
            console.error('Server Error', error);
         })
}


form.addEventListener("submit", (e)=> login(e));
