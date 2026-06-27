const menuBtn = document.getElementById("menu-btn")
const menuClose = document.getElementById("menu-close")
const menuUl = document.querySelector(".menu-ul")

menuBtn.addEventListener("click", function() {
    menuUl.classList.add("active")
})

menuClose.addEventListener("click", function() {
    menuUl.classList.remove("active")
})

function isLoginLogout() {

    const  isLogined = localStorage.getItem("elementry")

    if (isLogined) {
        return true
    } else {
        return false
    }
}

window.addEventListener("DOMContentLoaded", function() {
    const myPage = document.querySelector(".myPage")

    if (isLoginLogout() ) {
        myPage.style.display = "block"
    } else {
        myPage.style.display= "none"
    }
})