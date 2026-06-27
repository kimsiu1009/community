const titleEle = document.getElementById("title")
const authorEle = document.getElementById("author")
const dateEle = document.getElementById("date")
const contentEle = document.getElementById("content")
const saveBtn = document.querySelector(".save")
const cancelBtn = document.querySelector(".cancel")
const logout = document.querySelector(".logout")

let mode
let id
let phone

window.addEventListener("DOMContentLoaded", function() {
    
    const user = JSON.parse(localStorage.getItem("elementry"))
    console.log(user)

    if (!user) {
        location.href = "http://192.168.0.152:3500/login.html"
        return
    }

    let url = new URL(location.href)
    let currentParams = url.searchParams
    id = currentParams.get("id")
    let title = currentParams.get("title")
    let author = currentParams.get("author")
    let date = currentParams.get("date")
    let content = currentParams.get("content")
    mode = currentParams.get("mode")
    
    if (mode === "read") {

        titleEle.value = title
        authorEle.value = author
        dateEle.value = date
        contentEle.value = content
        saveBtn.style.display = "none"

        titleEle.readOnly = true
        authorEle.readOnly = true
        dateEle.readOnly = true
        contentEle.readOnly = true

    } else if (mode === "new") {

        let user = localStorage.getItem("elementry")
        let currentDate = new Date()

        user = JSON.parse(user)

        authorEle.value = user.name

        phone = user.phone

        dateEle.value = + currentDate.getFullYear() + "-" +  (currentDate.getMonth()+1).toString()  + "-" + currentDate.getDate()

    } else if (mode === "edit") {
        console.log(title, author, date, content)
        titleEle.value = title
        authorEle.value = author
        dateEle.value = date
        contentEle.value = content
    }


})

saveBtn.addEventListener("click", function() {

    const title = titleEle.value
    const author = authorEle.value
    // const date = dateEle.value
    const today = new Date()
    const date = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`
    const content = contentEle.value

    if (mode === "new") {
    
        fetch("http://192.168.0.152:3500/board/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                author,
                phone,
                date,
                content,
            })
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.errorMessage) {
                alert(data.errorMessage)
                return
            }
    
            alert("성공적으로 저장되었습니다")
    
            window.location.href = "http://192.168.0.152:3500/board.html"
        })

    } else if (mode === "edit") {

        fetch("http://192.168.0.152:3500/board/edit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                title,
                author,
                date,
                content,
            })
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.errorMessage) {
                alert(data.errorMessage)
                return
            }
    
            alert("성공적으로 수정되었습니다")
    
            window.location.href = "http://192.168.0.152:3500/board.html"
        })

    }

})

cancelBtn.addEventListener("click", function() {
    location.href = "http://192.168.0.152:3500/board.html"
})

logout.addEventListener("click", function() {
    localStorage.removeItem("elementry")
})