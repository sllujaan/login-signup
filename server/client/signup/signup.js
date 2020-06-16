var busy = document.getElementsByClassName("busy")[0]
var signup = document.getElementsByClassName("signup")[0]


var loginForm = document.getElementsByClassName("login-form")[0]


var users = [   {name:"jake", password:"123"},
                {name:"mike", password:"111"}
            ]



function onSubmit(e) {
    e.preventDefault()

    var name = e.target[0].value
    var password = e.target[1].value

    changeFormStatusToBusy(name,  password)


    signupDB(name, password)
    .then(data => {
        console.log(data)
        //setTokenLocalStorage(data.ACCESS_TOEKN)
        window.location.href = "/login"

    })
    .catch(err => {
        console.error(err)
        setSignUpError("There were some errors while signing you up! Please try again.")
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



    /*
        databaseLogin(name,  password)
        .then(res => {
            console.log(res)
            console.log(window.location)
            window.location.href = "/home"
        })
        .catch(err => {
            console.error(err)
            setLoginError("There were some errors while signing you up. Please try again.")
        })
    */


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



function databaseLogin(name, password) {
    return new Promise((resolve, reject) => {
        user = users.find(user => {
            return (user.name === name && user.password === password)
        })
        
        setTimeout(() => {
            if(!user) return reject("no user found.")
            resolve("success!!!") 
        }, 2000);
    })
    

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




async function signupDB(name, password) {

    const signupURL = `http://localhost:3000/signup`

    try{
        var res = await fetch(
            signupURL,
            {
                method: 'POST',
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify({name: name, password: password})
            }
        )


        if(res.status === 200) return res.json()
        return new Promise((resolve, reject) => {
            reject({status: res.status, statusText: res.statusText})
        })
    }
    catch(err) {
        console.error(err)
        return err
    }
}

