
const mongoose = require("mongoose");


const postSchema = mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    desc:{
        type:String,
        require:true
    },
    img:{
        type:String,
        
    },
    url:{
        type:String,
    }
}) 

module.exports  = mongoose.model('posts',postSchema)