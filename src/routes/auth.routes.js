const express = require('express');
const { Login, signUp } = require('../controllers/auth.controlers');

const router = express.Router();

router.get('/login',(req,res)=>{
    res.render('login',{error:''})
  })
router.post('/login', Login);

router.get('/register',(req,res)=>{
    res.render('register',{error:'',details:''})
  })
router.post('/register', signUp);


router.get('/logout',(req,res)=>{
 
  req.session.destroy();
  res.send('deleted')
  res.redirect('/login');
})


module.exports = router;