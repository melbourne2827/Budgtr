const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types
const User=require("./user")
const {postFunction} =require('./utility')

const EntrySchema=new mongoose.Schema({
    type:{
        type:Boolean,
        required:true
    },
    value:{
        type:Number,
        required:true
    },
    description:{
        type:String,
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

EntrySchema.virtual('fullDate').get(function(){
    return `${this.date.getDate()}/${this.date.getMonth()+1}/${this.date.getFullYear()}`
})

EntrySchema.post('save',postFunction)

EntrySchema.post('remove',async (doc) => {
    if(doc){
        const presentUser=await User.findById(doc.author)
        if(doc.type){
            presentUser.totalBalance-=doc.value
        }
        else{
            presentUser.totalBalance+=doc.value
        }
        await presentUser.save()
    }
})

module.exports=mongoose.model('Entry',EntrySchema)
