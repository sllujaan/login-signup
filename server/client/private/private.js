

var containerPrivateContent = document.querySelector(".container-private-content")

console.log(containerPrivateContent)
const USER_TOEKN = "____UUID__TOKEN0x03889100"


function processToken() {
    TOKEN = getToken(USER_TOEKN)
    if(!TOKEN) return showUnauthorizedUser("Unauthorized User No Token Found.")
    
    validToken()
    .then(data => {
        console.log(data)
        showTrustedUser("Welcome You are a trusted User!")
    })
    .catch(err => {
        console.error(err)
        return showUnauthorizedUser("Unauthorized User invalid Token.")
    })
}
processToken()


function getToken(TOKEN_ID) {
    return localStorage.getItem(TOKEN_ID)
}


function showUnauthorizedUser(message) {
    var h1 = document.createElement("h1")
    h1.classList.add("unauthorized")
    h1.innerText = `${message}`

    var span = document.createElement("span")
    span.classList.add("redirect")
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


function showTrustedUser(message) {
    var h1 = document.createElement("h1")
    h1.classList.add("trusted")
    h1.innerText = `${message}`

    containerPrivateContent.innerHTML = ''
    containerPrivateContent.append(h1)

}


async function validToken() {

    const privateURL = "http://localhost:3000/private"
    try{
        var res = await fetch(
            privateURL,
            {
                method: 'POST',
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Authorization': `Bearer ${getToken(USER_TOEKN)}`,
                    'Content-Type': 'application/json;charset=utf-8'
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                
            }
        )

        if(res.status === 200) return res.json()
        return new Promise((resolve, reject) => {
            reject({status: res.status, statusText: res.statusText})
        })
        
    }
    catch(err) {
        console.log(err)
        return err
    }
}