import { USER_TOEKN, setToken_localStorage, getToken_localStorage, removeToken_localStorage } from '../services/localStorage_services.js'
import { validToken } from '../services/client_server_api_services.js'
import { getBusyIcon } from '../services/common_services.js'


var containerPrivateContent = document.querySelector(".container-private-content")


function processToken() {
    var TOKEN = getToken_localStorage(USER_TOEKN)
    if(!TOKEN) return showUnauthorizedUser("Unauthorized User! No Token Found.")
    
    handleBusy()

    validToken()
    .then(data => {
        console.log(data)
        showTrustedUser(data.name)
    })
    .catch(err => {
        console.error(err)
        return showUnauthorizedUser("Unauthorized User! invalid Token.")
    })
}

processToken()


function showUnauthorizedUser(message) {

    removeToken_localStorage(USER_TOEKN)

    var h1 = document.createElement("h1")
    h1.classList.add("unauthorized")
    h1.innerText = `${message}`

    var span = document.createElement("span")
    span.classList.add("redirect", "responsive-link")
    span.innerHTML = `You will be redirected to <a href="/login">Login Page!</a> in `

    var timer = document.createElement("span")
    timer.classList.add("timer")
    var totalCount = 5
    timer.innerHTML = `${totalCount}`
    
    containerPrivateContent.innerHTML = ''
    containerPrivateContent.append(h1)
    containerPrivateContent.append(span)
    containerPrivateContent.append(timer)

    setInterval(() => {
        if(totalCount >= 0) {
            timer.innerHTML = `${totalCount}`
            totalCount--;
        }
        else{
            window.location.href = `/login`
        }
        
    }, 1000);


}


function showTrustedUser(name) {
    var h1 = document.createElement("h1")
    h1.classList.add("trusted")
    h1.innerHTML = `Welcome <span style="color:blue;">${name}</span> You are a trusted User!`

    var div_signout = document.createElement("div")
    div_signout.classList.add("signout")
    div_signout.innerHTML = `<a href="/signup">SignOut!</a>`

    //<div class="signout"><a href="/signup">SignOut!</a></div>
    containerPrivateContent.innerHTML = ''
    containerPrivateContent.append(h1)
    containerPrivateContent.append(div_signout)

}


function handleBusy() {
    containerPrivateContent.innerHTML = ''
    containerPrivateContent.append(getBusyIcon())
}