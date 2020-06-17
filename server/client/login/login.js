
import { USER_TOEKN, setToken_localStorage, getToken_localStorage } from "../services/localStorage_services.js"
import { login } from '../services/client_server_api_services.js'


var signup = document.getElementsByClassName("signup")[0]
var loginForm = document.getElementsByClassName("login-form")[0]

handleExistedToken(USER_TOEKN)



document.addEventListener('submit', e => {
    e.preventDefault()
    onSubmit(e)
})


function onSubmit(e) {

    var name = e.target[0].value
    var password = e.target[1].value

    changeFormStatusToBusy(name,  password)
    
    login(name, password)
    .then(data => {
        console.log(data)
        setToken_localStorage(data.ACCESS_TOEKN)
        window.location.href = "/private"

    })
    .catch(err => {
        console.error(err)
        //401 is unauthorized user---
        if((err.status === 401) || (err.status === 404)) return setLoginError("Name or Password is incorrect!")
        return setLoginError("Unkown Error! please contanct the administrator.")
    })    
}

function changeFormStatusToBusy(name,  password) {

    var error = document.getElementsByClassName("error-container")[0]
    var login = document.getElementById("login")

    if(error) error.remove()
    login.remove()
    loginForm.style.setProperty("pointer-events", "none")
    signup.style.setProperty("pointer-events", "none")
    loginForm.append(getBusyIcon())
}

function getBusyIcon() {
    var div = document.createElement('div')
    div.classList.add("busy")
    
    var content = `<svg  class="loading" width="40" height="40"  xmlns="http://www.w3.org/2000/svg">
                    <circle unicode="&#xf009;" id="loadingCircle" cx="20" cy="20" r="15"/>
                    </svg>`

    div.innerHTML = content
    return div
}


function setLoginError(error){
    loginForm.style.setProperty("pointer-events", "all")
    signup.style.setProperty("pointer-events", "all")
    
    var busy = loginForm.getElementsByClassName("busy")[0]
    busy.remove()

    var div_error = document.createElement("div")
    div_error.classList.add("error-container")
    div_error.innerText = error

    var input = document.createElement("input")
    input.setAttribute("id", "login")
    input.setAttribute("type", "submit")
    input.setAttribute("value", "Login")

    loginForm.append(div_error)
    loginForm.append(input)

}

function handleExistedToken(token) {
    if(getToken_localStorage(token)) window.location.href = "/private"
}



var checkReadyState = setInterval(() => {
    if (document.readyState === "complete") {
      clearInterval(checkReadyState)
      console.log('DOM is ready.')
      
      var form_name = document.querySelector("#name-uuid")
      form_name.focus()
      
    }
}, 100)
