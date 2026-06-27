const boardListContent = document.querySelector(".board-list-container")
const logout = document.querySelector(".logout")
const btn = document.querySelector(".board-btn")
const pageContainer = document.querySelector(".page-container")
const searchAuthor = document.querySelector(".search-author")
const searchDate = document.querySelector(".search-date")
const boardSearchBtn = document.querySelector(".board-search-btn")


let totalPages
let currentPage
let author = ""
let date = ""

logout.addEventListener("click", function() {
    localStorage.removeItem("elementry")
})

window.addEventListener("DOMContentLoaded", function() {

    const user = JSON.parse(localStorage.getItem("elementry"))
    console.log(user)
    
    if (!user) {
        location.href = "http://192.168.0.152:3500/login.html"
        return
    }   
    
    currentPage = 1
    localStorage.setItem("elementry-currentPage", currentPage)
    createBoard(currentPage)
    
    console.log(searchAuthor, searchDate)

    boardSearchBtn.addEventListener("click", function() {

        author = searchAuthor.value
        date = searchDate.value

        createBoard(currentPage, searchAuthor.value, searchDate.value)

    })

})

function createBoard(currentPage, author = "", date = "") {

    const user = JSON.parse(localStorage.getItem("elementry"))

    fetch("http://192.168.0.152:3500/board/list", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({  
            currentPage,
            author,
            date
        })
    })
    .then((response) => response.json())
    .then((data) => {
        
        console.log(data.boardList, data.total)

        let user = localStorage.getItem('elementry')
        user = JSON.parse(user)

        const boardList = data.boardList.map(function(value) {
            let txt = `            
            <div class="board-list">
                <div class="board-list-content" data-id="${value._id}" data-title="${value.title}" data-author="${value.author}" data-date="${value.date}" data-content="${value.content}">
                    <p>${value.title}</p>
                    <p>${value.date}</p>
                    <p>${value.author}</p>
                    </div>
                    <div class="board-btn-container">
                `
                if (user.phone === value.phone) {
                    txt = txt + `
                        <i class="edit fas fa-edit" data-id="${value._id}" data-title="${value.title}" data-author="${value.author}" data-date="${value.date}" data-content="${value.content}"  ></i>
                        <i class="delete fas fa-trash-alt" data-id="${value._id}" ></i>
                        `
                    } 
                    
                    txt = txt + `
                    </div> 
                    </div>
                `

            return txt
            
        }).join("")


        boardListContent.innerHTML = boardList
        
        const board = document.querySelectorAll(".board-list-content")
        const editBtns = this.document.querySelectorAll(".edit")
        const deletebtns = document.querySelectorAll(".delete")

        board.forEach(function(item) {
            item.addEventListener("click", function(e) {

                let id = e.currentTarget.dataset.id
                let title = e.currentTarget.dataset.title
                let author = e.currentTarget.dataset.author
                let date = e.currentTarget.dataset.date
                let content = e.currentTarget.dataset.content
                console.log(id)

                let params = new URLSearchParams()

                params.append('id', id)
                params.append('title', title)
                params.append('author', author)
                params.append('date', date)
                params.append('content', content)
                params.append('mode', 'read')

                location.href =`http://192.168.0.152:3500/boardContent.html?${params.toString()}`
            })

        })

        editBtns.forEach(function(item) {
            item.addEventListener("click", function(e) {
                console.log(e.currentTarget.dataset.id)
                let id = e.currentTarget.dataset.id
                let title = e.currentTarget.dataset.title
                let author = e.currentTarget.dataset.author
                let date = e.currentTarget.dataset.date
                let content = e.currentTarget.dataset.content

                let params = new URLSearchParams()

                params.append('id', id)
                params.append('title', title)
                params.append('author', author)
                params.append('date', date)
                params.append('content', content)
                params.append('mode', 'edit')

                location.href =`http://192.168.0.152:3500/boardContent.html?${params.toString()}`
            })
        })

        deletebtns.forEach(function(item) {
            item.addEventListener("click", function() {

                const isTrue = confirm("게시물을 삭제 하시겠습니까?")

                if (isTrue) {

                    fetch("http://192.168.0.152:3500/board/delete", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            id: item.dataset.id
                        })
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.errorMessage) {
                            alert(data.errorMessage)
                            return
                        }
                        window.location.href = "http://192.168.0.152:3500/board.html"
                    })
                    
                } else {
                    return
                }

            })
        })

        totalPages = divide(data.total)

        //초기 랜더링
        renderPagination(totalPages, currentPage)
    
    })
}

btn.addEventListener("click", function() {

    let params = new URLSearchParams()
    params.append('mode', "new")

    const user = localStorage.getItem("elementry")

    if (!user) {
        location.href =`http://192.168.0.152:3500/login.html`
    } else {
        location.href =`http://192.168.0.152:3500/boardContent.html?${params.toString()}`
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
        createBoard(currentPage, author, date)
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
