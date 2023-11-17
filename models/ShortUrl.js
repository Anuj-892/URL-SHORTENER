const mongoose = require("mongoose");
const nanoid = require('nanoid')

const shortUrlSchema = new mongoose.Schema({
    full:{
        type:String,
        required:true
    },
    short:{
        type:String,
        required:true,
        default:`NANO/${nanoid(5)}`
    }
},{timestamps:true})

module.exports = mongoose.model("ShortUrl",shortUrlSchema)