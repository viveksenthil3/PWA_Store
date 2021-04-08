exports.isValidLogin=(req,res,next)=>{
    if(!req.session.isLogin)
        res.redirect('/login')
    else
        next()    
}


exports.isLoggedin=(req,res,next)=>{
    if(!req.session.isLogin)
        res.status(401).send()
    else
        next()    
}