const router = require("express").Router()
const Board = require("../models/boardModel")

//  친구소식 등록
router.post('/save', async (req, res) => {
    
    try {
        const {title, author, phone, date, content} = req.body // 구조분해 방식
        if (!title || !author || !date || !content) {
            return res.status(400).json({errorMessage: "제목, 작성자, 작성일자, 내용을 모두 입력하세요."})
        }
        
        const newBoard = new Board({
            title,
            author,
            phone,
            date,
            content
        })

        const savedBoard = await newBoard.save()
        
        res.send({result: "success"})

    } catch (err) {
        res.status(500).send({errorMessage: err})
    }

})

// List

router.post('/list', async (req, res) => {
    try {
        const {author, date, currentPage} = req.body
        const skipAmount = (currentPage - 1) * 5

        const query = {}
        if (author) {
            query.author = author
        }
        if (date) {
            query.date = date
        }

        console.log(query)

        const totalList = await Board.find(query)
        const boardList = await Board.find(query).sort({createdAt: -1}).skip(skipAmount).limit(5)
        res.send({boardList, total: totalList.length})
    
    } catch (err) {
        res.status(500).send({errorMessage: err})
    }

})

router.get('/list', async (req, res) => {
    try {
        const boardList = await Board.find({}).sort({createdAt: -1}).limit(5)
        res.send({boardList})
    
    } catch (err) {
        res.status(500).send({errorMessage: err})
    }

})

// delete

router.post('/delete', async (req, res) => {
    try {
    
        const {id} = req.body
        await Board.findByIdAndDelete({_id: id})
        res.send({reslut: "success"})
    
    } catch (err) {
        res.status(500).send({errorMessage: err})
    }

}) 

// edit

router.post('/edit', async (req, res) => {
    try {
        const {id, title, author, date, content} = req.body // 구조분해 방식
        console.log(id, title, author, date, content)

        if (!title || !author || !date || !content) {
            return res.status(400).json({errorMessage: "제목, 작성자, 작성일자, 내용을 모두 입력하세요."})
        }
        
        const board = await Board.findOne({
            _id: id
        })

        
        board.title = title
        board.author = author
        board.date = date
        board.content = content

        await board.save()

        res.send({result: "success"})

    } catch (err) {
        res.status(500).send({errorMessage: err})
    }
})

module.exports = router