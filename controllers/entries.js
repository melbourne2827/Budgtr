const Entry=require('../models/entry');
const User = require('../models/user');

module.exports.index= async (req,res) =>{
    const entries=await Entry.find({author:req.user._id}).sort({"date":-1})
    // console.log(req.user.totalBalance)
    // console.log(entries[0].date);
    let totalIncome=0,totalExpense=0;
    entries.forEach(element=>{
        let val=element.value
        totalIncome+=(element.type==1)*val
        totalExpense+=(element.type==0)*val
    })
    res.render('entries/index',{entries,totalIncome,totalExpense})
}

module.exports.createEntry=async (req,res)=>{
    const entry=new Entry(req.body.entry)
    entry.author=req.user._id
    await entry.save()
    if(entry.type==1){
        req.user.totalBalance+=(entry.value)
    }
    else{
        req.user.totalBalance-=(entry.value)
    }
    const registeredUser=await User.findById(req.user._id)
    registeredUser.totalBalance=req.user.totalBalance
    await registeredUser.save()
    req.flash('success','Successfully added a entry!')
    res.redirect('/')
}

module.exports.deleteEntry=async (req,res) =>{
    const entry=await Entry.findById(req.params.id)
    if(!entry){
        req.flash('error','Cannot find the entry')
    }
    else{
        await entry.remove()
        if(entry.type==1){
            req.user.totalBalance-=(entry.value)
        }
        else{
            req.user.totalBalance+=(entry.value)
        }
        const registeredUser=await User.findById(req.user._id)
        registeredUser.totalBalance=req.user.totalBalance
        await registeredUser.save()
        req.flash('success','Successfully deleted a entry')
    }
    res.redirect('/')
}
