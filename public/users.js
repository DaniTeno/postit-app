const d = document;
const url = window.location.origin
const emailRegEx = /\S+@\S+\.\S+/;
const stringRegEx = /[A-Za-z0-9]/

const validEmail = (email) => {
    if(typeof email !== 'string') return false
    if(emailRegEx.test(email)) return email
    else return false
}

const validString= (string, n) => {
    if(typeof string !== 'string') return false
    if(string.length < n) return false
    if(stringRegEx.test(string)) return string
    else return false
}


const events = () => {
    const registerForm = d.getElementById('register');
    const loginForm = d.getElementById('login');
    const changeFormBtn = d.querySelectorAll('.change-form');
    const nav = d.querySelector('#form-container nav');
    let checkEmail = false;
    let checkName = false;
    let checkPass = false;
    let checkCPass = false;
    d.addEventListener("click", (e) => {
        changeFormBtn.forEach(btn => {
            if(e.target == btn){
                (nav.style.right == "0px") ? nav.style.right = "350px" : nav.style.right = "0px";
            };
        });

        if(e.target == registerForm.register) {
            e.preventDefault();
            if(e.target.classList.value.includes('disabled')) return
            fetch(`${url}/api/users/register`, {
                method: "POST",
                headers: 
                {
                    "content-type" : "application/json"
                },
                body: JSON.stringify(
                {
                    name: registerForm.nickname.value,
                    email: registerForm.email.value,
                    password: registerForm.password.value,
                })
            })
            .then(res => res.ok ? res.json() : Promise.reject(res, alert('Email already in use')))
            .then(json => {
                    localStorage.setItem("user", JSON.stringify(json));
                    return window.location = url
            });
        };

        if(e.target == loginForm.login) {
            e.preventDefault(); 
            fetch(`${url}/api/users/login`, {
                method: "POST",
                headers: 
                {
                    "content-type" : "application/json"
                },
                body: JSON.stringify(
                {
                    email: loginForm.email.value,
                    password: loginForm.password.value,
                })
            })
            .then(res => res.ok ? res.json() : Promise.reject(alert('Invalid Email/Password')))
            .then(json => {
                    localStorage.setItem("user", JSON.stringify(json));
                    return window.location = url
            });
        };
    });

    d.addEventListener("keyup", async (e) => {
            if(e.target == registerForm.email){
                if(validEmail(registerForm.email.value) !== false) {
                    e.target.nextElementSibling.innerHTML = '&#9745;'
                    checkEmail = true
                } else {
                    e.target.nextElementSibling.innerHTML = '&#9746;'
                    checkEmail = false
                }
            }
            if(e.target == registerForm.nickname){
                if(validString(registerForm.nickname.value, 3) !== false) {
                    e.target.nextElementSibling.innerHTML = '&#9745;'
                    checkName = true;
                } else {
                    e.target.nextElementSibling.innerHTML = '&#9746;'
                    checkName = false;
                } 
            }
            if(e.target == registerForm.password){
                if(validString(registerForm.password.value, 5) !== false) {
                    e.target.nextElementSibling.innerHTML = '&#9745;'
                    checkPass = true;
                } else {
                    e.target.nextElementSibling.innerHTML = '&#9746;'
                    checkPass = false;
                } 
            }
            if(e.target == registerForm.confirmPassword){
                if(registerForm.confirmPassword.value == registerForm.password.value) {
                    e.target.nextElementSibling.innerHTML = '&#9745;'
                    checkCPass = true;
                } else {
                    e.target.nextElementSibling.innerHTML = '&#9746;'
                    checkCPass = false;             
                } 
            }
            if(checkCPass && checkEmail && checkName && checkPass) registerForm.register.classList.remove('disabled')
    });
};

document.addEventListener("DOMContentLoaded", () => {
    events();
});