import { USER_TOEKN, setToken_localStorage, getToken_localStorage, removeToken_localStorage } from "../services/localStorage_services.js"
import { signupDB } from '../services/client_server_api_services.js'

var signup = document.getElementsByClassName("signup")[0]
var loginForm = document.getElementsByClassName("login-form")[0]

document.addEventListener('submit', e => {
    e.preventDefault()
    onSubmit(e)
})

removeToken_localStorage(USER_TOEKN)

function onSubmit(e) {

    var name = e.target[0].value
    var password = e.target[1].value

    changeFormStatusToBusy(name,  password)

    signupDB(name, password)
    .then(data => {
        console.log(data)
        window.location.href = "/signup/?status=success"

    })
    .catch(err => {
        console.error(err)
        if(err.status === 409) return setSignUpError("User Name has been taken already! Please try different one.")
        return setSignUpError("There were some errors while signing you up! Please try again.")
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





function setSignUpError(error){
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
    input.setAttribute("value", "SignUp Now!")

    loginForm.append(div_error)
    loginForm.append(input)

}




var checkReadyState = setInterval(() => {
    if (document.readyState === "complete") {
      clearInterval(checkReadyState)
      console.log('DOM is ready.')
      
      var form_name = document.querySelector("#name-uuid")
      form_name.focus()
      
    }
}, 100)
