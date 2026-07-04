const container = document.querySelector(".blog-container")
const newsUl =  document.querySelector(".news-ul")
const logout = document.querySelector(".logout")

window.addEventListener("DOMContentLoaded", async function() {

    await fetch("/blog/list")
    .then((response) => response.json())
    .then((data) => {
        const blogs = data.result.map(function(value, index, array) {
            return `
                <div class="card">
                    <div class="card-img">
                        <img class="img" src="${'/blog_images/' + value.image}" alt="">
                    </div>
                    <div class="title">${value.title}</div>
                    <div class="desc">
                        <div class="date-author">
                            <p class="date">${value.date}</p>
                            <p class="author">${value.name}</p>
                        </div>
                        <div class="content">${value.content}</div>
                    </div>  
                    <div class="btn-container">
                        <a href="/blog.html" class="btn blog-btn">더 보기</a>
                    </div>     
                </div>
            `
        }).join("")
        container.innerHTML = blogs
    })

    await fetch("/board/list")
    .then((response) => response.json())
    .then((data) => {
        console.log(data)
        const news = data.boardList.map(function(value, index, array) {
            return `
            <li onclick="goBoard()">
                <p class="title">${value.title}</p>
                <div class="news-box">
                    <p class="date">${value.date}</p>
                    <p class="author">${value.author}</p>
                </div>
            </li>
            `
        }).join("")
        newsUl.innerHTML = news
    })


})

logout.addEventListener("click", function() {
    localStorage.removeItem("elementry")
})

function goBoard() {
    const user = JSON.parse(localStorage.getItem("elementry"))

    if (!user) {
        location.href = "/login.html"
    } else {
        location.href='/board.html'
    }   

}