


var containerSuccess = document.querySelector(".container-success")

console.log(containerSuccess)


function showSingnupSuccess() {

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