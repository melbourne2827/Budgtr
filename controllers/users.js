const User=require('../models/user')

module.exports.registerForm=(req,res)=>{
    res.render('users/register')
}

module.exports.registerUser=async(req,res)=>{
    try{
        const {username,email,password,phoneNumber}=req.body
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password)
        if(phoneNumber){
            registeredUser.phoneNumber=phoneNumber
        }
        const value=0
        const mark=0
        const commonArr=[]
        for(let i=0;i<12;i++){
            commonArr.push({value,mark})
        }
        registeredUser.foodExpenditure=commonArr
        registeredUser.leisureExpenditure=commonArr
        registeredUser.shoppingExpenditure=commonArr
        registeredUser.miscExpenditure=commonArr
        await registeredUser.save()
        req.login(registeredUser,(err=>{
            if(err){
                return next(err)
            }
            req.flash('success','Welcome to Budgtr!')
            res.redirect('/')
        }))
    }
    catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
}

module.exports.loginForm=(req,res)=>{
    res.render('users/login')
}

module.exports.loginUser=(req,res)=>{
    req.flash('success','Welcome back!')
    const redirectUrl=req.session.returnTo || '/'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.logoutUser=async (req,res,next)=>{
    req.logout()
    req.flash('success','Goodbye! See you soon again')
    res.redirect('/login')
}
