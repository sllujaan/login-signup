import { USER_TOEKN, getToken_localStorage } from "./localStorage_services.js"


//set ENVIRONMENT variable to developement is you are working locally.
//set ENVIRONMENT variable to production is you are working locally.
const PRODUCTION = 'PRODUCTION'
const DEVELOPEMENT = 'DEVELOPEMENT'

const ENVIRONMENT = PRODUCTION

const serverUrl_production = `https://authpro.herokuapp.com`
const serverUrl_developement = `http://localhost:3000`

var serverUrl = null

if(ENVIRONMENT === 'PRODUCTION') serverUrl = serverUrl_production
else serverUrl = serverUrl_developement





export async function login(name, password) {

    const loginURL = `${serverUrl}/login`

    var res = await fetch(
        loginURL,
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




export async function signupDB(name, password) {

    const signupURL = `${serverUrl}/signup`
    
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




export async function validToken() {

    const privateURL = `${serverUrl}/private`

    var res = await fetch(
        privateURL,
        {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Authorization': `Bearer ${getToken_localStorage(USER_TOEKN)}`,
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