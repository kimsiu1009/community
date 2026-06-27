const mongoose = require("mongoose")

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: String
    },
},

{
    timestamps: true
}

)

const Board = mongoose.model("board", boardSchema)

module.exports = Board