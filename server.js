const express = require("express")
const mongoose = require("mongoose")

const path = require("path")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const multer = require("multer")
const fs = require("fs")


dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())
app.use(express.static(path.join(__dirname, "public")))

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, 'public', "/index.html"))
})
app.get("/index", function (req, res) {
    res.sendFile(__dirname + "/index.html")
})
app.get("/index.html", function (req, res) {
    res.sendFile(__dirname + "/index.html")
})


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'public/blog_images/'

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath)
        }

        cb(null, uploadPath)

    },
    filename: (req, file, cb) => {
        const newFileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        cb(null, newFileName)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['.jpg', '.jpeg', '.png']

    if (allowedFileTypes.includes(path.extname(file.originalname))) {
        cb(null, true)
    } else {
        cb(new Error('Invalid file type'))
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 40},
    fileFilter: fileFilter
})

const PORT = process.env.PORT || 3500;

app.use("/auth", require("./routers/userRouter"))

app.use("/board", require("./routers/boardRouter"))

app.use("/blog/new", upload.single('image'), require("./routers/blogRouter"))

app.use("/blog", require("./routers/blogRouter"))

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
    mongoose.connect(
        process.env.MONGODB_CONNECT,{}
    )
    .then(() => { 
        console.log("Mongo DB Connected...")
    })
    .catch((error) => console.log(error))
})
