

export const USER_TOEKN = "____UUID__TOKEN0x03889100"


export function setToken_localStorage(value) {
    return localStorage.setItem(USER_TOEKN, value)
}

export function getToken_localStorage(TOKEN_KEY) {
    return localStorage.getItem(TOKEN_KEY)
}

export function removeToken_localStorage(TOKEN_KEY) {
    return localStorage.removeItem(TOKEN_KEY)
}