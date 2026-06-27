const imageInput = document.getElementById("imageInput")
const preview = document.getElementById("preview")
const uploadBtn = document.getElementById("uploadBtn")
const blogDate = document.getElementById("blog-date")
const blogContent = document.getElementById("blog-text")
const blogTitle = document.getElementById("blog-title")
const logout = document.querySelector(".logout")

let uploadFile

const date = new Date()
const today = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
blogDate.value = today

window.addEventListener("DOMContentLoaded", function() {
    
    const user = JSON.parse(localStorage.getItem("elementry"))
    console.log(user)

    if (!user) {
        location.href = "http://192.168.0.152:3500/login.html"
        return
    }   
})

document.getElementById("fileSelect").addEventListener('click', function(e) {
    document.getElementById("imageInput").click()
})

imageInput.addEventListener("change", function(event) {
    uploadFile = event.target.files[0]
    if (uploadFile) {
        // 1. 이미지 미리보기
        const reader = new FileReader()
        reader.onload = function (e) {
            preview.src = e.target.result
            preview.style.display = "block"
        }
        reader.readAsDataURL(uploadFile)
    }
})

uploadBtn.addEventListener("click", async function() {

    let user = localStorage.getItem("elementry")
    user = JSON.parse(user)

    const formData = new FormData()
    formData.append("image", uploadFile)
    formData.append("name", user.name)
    formData.append("phone", user.phone)
    formData.append("date", blogDate.value)
    formData.append("content", blogContent.value)
    formData.append("title", blogTitle.value)

    await fetch("http://192.168.0.152:3500/blog/new", {
        method: "POST",
        body: formData,
    }) 
    .then((response) => {
        // 1. HTTP 응답 상태 확인
        if (!response.ok) {
            throw new Error("Network response was nor ok")
        }
        // 2. JSON 데이터로 파싱하여 다음 then으로 전달
        return response.json()
    })
    .then((data) => {
        // 3. 실제 데이터 처리
        console.log(data)

        location.href = "./blog.html"
    })
    .catch((error) => {
        console.error("Fetch error:", error)
    })
})

logout.addEventListener("click", function() {
    localStorage.removeItem("elementry")
})