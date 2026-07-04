const blogListContainer = document.querySelector(".blog-list-container")
const paginationList = document.querySelector(".pagination-list")
const logout = document.querySelector(".logout")
const blogBtn = document.querySelector(".blog-btn")
const blogSearchBtn = document.querySelector(".blog-search-btn")
const searchAuthor = document.querySelector(".search-author")

let totalPages
let currentPage

window.addEventListener("DOMContentLoaded", function() {

    const user = JSON.parse(localStorage.getItem("elementry"))
    console.log(user)

    if (!user) {
        location.href = "/login.html"
        return
    }

    currentPage = 1
    localStorage.setItem("elementry-currentPage", currentPage)
    createBlog("all")

})

function createBlog(mode) {
    const query = {
        currentPage
    }

    if (mode === "search") {
        query.author = searchAuthor.value
    }

    const user = JSON.parse(localStorage.getItem("elementry"))

    fetch("/blog/list", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(query)
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data)
        let list = data.blogList.map(function(value) {
            console.log(value)
            return `
                <div class="blog-item">
                    <div class="blog-img-container">
                        <img src="${"/blog_images/" + value.image}" alt="blog_images">
                        <div class="blog-title-container">
                            <div class="blog-data">
                                <p class="title">${value.title}</p>
                                <p class="content">${value.content}</p>
                                <div class="blog-footer">
                                    <div class="author-date">
                                        <p>${value.name} &nbsp;&nbsp;&nbsp; ${value.date}</p>
                                    </div>
                                    <div class="blog-btn-container">
                                        <i class="delete fas fa-trash-alt" data-id=${value._id}></i>
                                    </div>
                                </div>                        
                            </div>

                        </div>         
                    </div>
                </div>
            `
        }).join("")
        blogListContainer.innerHTML = list

        totalPages = divide(data.total)

        //초기 랜더링
        renderPagination(totalPages, currentPage)

        const deleteBtns = document.querySelectorAll(".delete")
        
        deleteBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {

                const isTrue = confirm("블로그를 삭제 하시겠습니까?")

                if (isTrue) {

                    const id = e.currentTarget.dataset.id
    
                    fetch("/blog/delete", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                name: user.name, 
                                id
                            })
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        currentPage = 1
                        localStorage.setItem("elementry-currentPage", currentPage)
                        createBlog(currentPage)
                    })

                } else {
                    return
                }

            })
        })
    })

}

blogBtn.addEventListener("click", function() {
    const user = localStorage.getItem("elementry")
    console.log(user)

    if(!user) {
        location.href = "/login.html"
    } else {
        location.href = "/blogContent.html"
    }
    
})

function renderPagination(totalPages, currentPage) {
    const paginationContainer = document.querySelector(".page-container")
    paginationContainer.innerHTML = ""

    // 1. 보여줄 버튼의 범위 계산
    let startPage = Math.max(1, currentPage - 1) // 현재 페이지 기준 앞 2개  
    let endPage = Math.min(totalPages, startPage + 2) // 현재 페이지 기준 뒤 2개

    // 범위 제조정 (endPage가 5개 미만일 때 startPage 조정)
    if (endPage - startPage < 2) {
        startPage = Math .max(1, endPage - 2)
    }

    // 2. '처음' 버튼
    if (currentPage > 1) {
        const firstBtn = createButton("<i class='fas fa-chevron-left'></i>", 1)
        paginationContainer.appendChild(firstBtn)
    }

    // 3. 페이지 번호 버튼 생성
    for (let i = startPage; i <= endPage; i++) {
        const button = createButton(i, i)
        if (i === currentPage) {
            button.classList.add("active")
        }
        paginationContainer.appendChild(button)
    } 

    // 4. '끝' 버튼
    if (currentPage < totalPages) {
        const lastBtn = createButton("<i class='fas fa-chevron-right'></i>", totalPages)
        paginationContainer.appendChild(lastBtn)
    }
}

// 버튼 생성 헬퍼 함수
function createButton(text, page) {
    const button = document.createElement("button")
    button.innerHTML = text
    button.addEventListener("click", () => {
        currentPage = page
        createBlog(currentPage)
        // renderPagination(totalPages, currentPage) 
    })
    return button
}

function divide(dividend) {
    let quotient = Math.floor(dividend / 5)
    let remainder = dividend % 5
    if (remainder > 0) {
        quotient = quotient + 1
    }

    return quotient
}

logout.addEventListener("click", function() {
    localStorage.removeItem("elementry")
})

blogSearchBtn.addEventListener("click", function() {

        currentPage = 1
        localStorage.setItem("elementry-currentPage", currentPage)
        createBlog("search")

})