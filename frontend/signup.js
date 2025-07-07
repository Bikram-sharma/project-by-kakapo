const form= document.getElementById ("signupForm");

function signup(e){
    e.preventDefault()
    const formData = new FormData(form);
    const body = Object.fromEntries(formData);

    axios.post("https://localhost:3000/signup",body)
         .then(response => {
            if(response.status === 201){
                window.location.href = 'login.html';

            } else {
            console.error('Registration Failed', response.status);
            }
         })
         .catch(error =>{
            console.error('Server Error', error);
         })
}


form.addEventListener("submit", (e)=> signup(e));

