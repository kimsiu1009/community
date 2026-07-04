window.addEventListener("DOMContentLoaded", function(){

    const logout = document.querySelector(".logout")
    const login = document.querySelector(".login")
    const isLogined = localStorage.getItem("elementry")
    const register = document.querySelector(".register")

    if (isLogined) {
        login.style.display = "none"
        logout.style.display = "block"
        register.style.display = "none"
        
    } else {
        login.style.display = "block"
        logout.style.display = "none"
        register.style.display = "block"
    }

    logout.addEventListener("click", function() {
        localStorage.removeItem("elementry")
    })

})