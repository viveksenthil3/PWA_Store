const express = require('express');
const { Login, signUp, isLoggedin, logout } = require('../controllers/auth.controlers');

const router = express.Router();

router.get('/login',(req,res)=>{
    res.render('login',{error:''})
  })

router.post('/login', Login);

router.post('/isLoggedin', isLoggedin);

router.get('/register',(req,res)=>{
    res.render('register',{error:'',details:''})
  })

router.post('/register', signUp);


// router.get('/logout',(req,res)=>{
 
//   req.session.destroy();
//   res.send('deleted')
//   res.redirect('/login');
// })

router.get('/logout', logout)


module.exports = router;