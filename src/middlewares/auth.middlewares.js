exports.isValidLogin=(req,res,next)=>{
    if(!req.session.isLogin)
        res.redirect('/login')
    else
        next()    
}
