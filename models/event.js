const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types
const User=require("./user")

const EventSchema=new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    value:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    author:{
        type:ObjectId,
        ref:'User'
    }
})

module.exports=mongoose.model('Event',EventSchema)
