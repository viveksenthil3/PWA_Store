const {signUpDB}=require('../models/user.model');
const session = require('express-session');
exports.signUp=(req,res)=>{
    const {
        firstname,
        lastname,
        email,
        password,
        conpassword,
    }=req.body;
    const user=new signUpDB({
        firstname,
        lastname,
        email,
        password,
        conpassword,
    });
    const value={fn:firstname,ln:lastname,email:email,pass:password,conpass:conpassword,};
    if(!(email && password&&firstname&&lastname&&conpassword)){
         res.status(409).render('register',{error:'email cannot be empty',details:value})
        
    }
    signUpDB.findOne({email:email},(error,data)=>{
        if(error || data==null)
            res.status(409).render('register',{error:'conflict user already exists'})
    });
    user.save((error,data)=>{
        if(error){
            res.status(400).render('register',{error: 'something went wrong'});
         
        }
        else{
            res.status(200).redirect('/login');
        }
           
    });
}
exports.Login=(req,res)=>{
    const{
        email,
        password,
    }=req.body;
    if(!(email && password)){
        res.status(409).render('login',{error:'email or password cannot be empty'})
        
    }
    else{

        signUpDB.findOne({email:email,password:password},(error,data)=>{
            if(error||data==null ){
                res.status(401).render('login',{error:'email or password mismatch'});    
            }
            else{
                req.session.isLogin=true;
                req.session.email=email;
                req.session.username=data.firstname;
                res.status(200).redirect('/');
                
            }    
        }); 
        
    }
}

exports.isLoggedin=(req,res)=>{
    if(!req.session.isLogin)
        res.status(401).send()
    else
        res.send()    
}

exports.logout=(req,res)=>{
    delete req.session  
    res.redirect('/')
}