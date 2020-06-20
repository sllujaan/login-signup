



export function getBusyIcon() {
    var div = document.createElement('div')
    div.classList.add("busy")
    
    
    //you must link loading.css file in your html in order to work for loading.
    var content = `<svg  class="loading" width="40" height="40"  xmlns="http://www.w3.org/2000/svg">
                    <circle unicode="&#xf009;" id="loadingCircle" cx="20" cy="20" r="15"/>
                    </svg>`

    div.innerHTML = content
    return div
}