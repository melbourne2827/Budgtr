const {entrySchema,userSchema}=require('./schemas')
// const ExpressError=require('./utils/expressError')
const Entry=require('./models/entry')

module.exports.validateEntry=(req,res,next)=>{
    const result=entrySchema.validate(req.body)
    if(result.error){
        // console.log(result.error)
        const msg=result.error.details.map(el=>el.message).join(',')
        req.flash('error',msg)
        return res.redirect('/')
    }
    else{
        next()
    }
}  

module.exports.validateUser=(req,res,next)=>{
    const result=userSchema.validate(req.body)
    if(result.error){
        // console.log(result.error)
        const msg=result.error.details.map(el=>el.message).join(',')
        req.flash('error',msg);
        return res.redirect('/register')
    }
    next();
}

module.exports.loggedIn=(req,res,next)=>{
    // console.log(req.user)
    if(!req.isAuthenticated()){
        // console.log(req.originalUrl)
        req.session.returnTo=req.originalUrl
        // console.log(0,req.session)
        return res.redirect('/login')
    }
    next()
}

module.exports.isAuthorisedEntry= async (req,res,next)=>{
    const {id}=req.params;
    const entry=await Entry.findById(id)
    if(!entry || !entry.author.equals(req.user._id)){
        req.flash('error','You do not have access for it')
        return res.redirect(`/${id}`)
    }
    next()
}

