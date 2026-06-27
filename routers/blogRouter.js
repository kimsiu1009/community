const express = require("express")
const router = express.Router()
const Blog = require("../models/blogModel")

router.post("/new", async (req, res) => {

    
    try {
        const {name, phone, date, title, content } = req.body

        console.log(name, phone, date, title, content)
        
        const newBlog = new Blog({
            name,
            phone,
            date,
            title,
            content,
            image: req.file.filename
        })

        const savedBlog = await newBlog.save()
        
        res.send({result: "success"})
    } catch (err) {
        res.send({result: "fail"})
    }

})

router.get("/list", async (req, res) => {
    try {
        const result = await Blog.find({}).limit(6).sort({date: -1})
        
        res.send({result: result})
    } catch (err) {
        res.send({result: "fail"})
    }

})

router.post("/delete", async (req, res) => {
    const {name, id} = req.body
    try {
        console.log(name, id)
        const result = await Blog.findOneAndDelete({_id: id})
        console.log(result)
        
        res.send({result: result})
    } catch (err) {
        res.send({result: "fail"})
    }
})

router.post("/list", async (req, res) => {
    const query = {}
    try {
        const {author, currentPage} = req.body
        console.log(author, currentPage)

        if (author !== undefined) {
            query.name = author
        }

        console.log("query", query)
        const skipAmount = (currentPage - 1) * 5
        const totalList = await Blog.find(query)
        const blogList = await Blog.find(query).sort({createdAt: -1}).skip(skipAmount).limit(5)
        res.send({blogList, total: totalList.length})

    } catch (err) {
        res.status(500).send({errorMessage: err})
    }

})

module.exports= router