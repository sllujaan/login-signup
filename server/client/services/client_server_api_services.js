










export async function login(name, password) {

    const loginURL = `http://localhost:3000/login`

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

    const signupURL = `http://localhost:3000/signup`
    
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