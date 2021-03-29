require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const  bodyParser = require('body-parser')

const PORT = process.env.PORT || 5000
// Mongoose configuration for Mongo Atlas cloud DB connection (with schema)
const mongoose = require('mongoose');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

//passport js
const passport=require('passport');
const localStrategy=require('passport-local').Strategy;
const crypto=require('crypto')

var app = express();

var conn=mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.6tpfq.mongodb.net/PWA_Store?retryWrites=true&w=majority`, 
  {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
  }
)
.then(_=>console.log('connected to db'))
.catch(error=>console.log(error));


 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('public'))
app.use(expressLayouts)

//Middlewares
var sessionStore=new MongoDBStore({
  uri:`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.6tpfq.mongodb.net/PWA_Store?retryWrites=true&w=majority`,
  collection:'sessions',
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true
  }
});

app.use(session({
  // key:process.env.SESS_NAME,
  // name:"tamil",
  secret:process.env.SESS_SECRET,
  resave:false,
  saveUninitialized:true,
  store: sessionStore,
  cookie:{
    maxAge: 1000*60*60*2,//two hours,//process.env.SESS_LIFETIME,
    // sameSite:true 

  }
}))

app.set('layout', './layouts/main_layout')
app.set('view engine', 'ejs')


const pwaRoutes = require('./src/routes/pwa.routes')

app.use('/', pwaRoutes);
app.use('/',require('./src/routes/auth.routes'));

const{isValidLogin}=require('./src/middlewares/auth.middlewares');


//Routes

app.get('/', isValidLogin,(req, res)=>{
   
  res.render('home')
 
  
})

app.get('/detailedView', (req, res)=>{
    res.render('detailedView')
})

app.get('/createPWA', (req, res)=>{
  res.render('savePWA')
})


//Listen on the specified port
app.listen(PORT, _=>{
    console.log(`Listining on PORT-> ${PORT}`)
})
