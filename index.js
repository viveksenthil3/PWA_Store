require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const  bodyParser = require('body-parser')

const app = express()
const PORT = process.env.PORT || 5000


// Mongoose configuration for Mongo Atlas cloud DB connection (with schema)
const mongoose = require('mongoose')

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.6tpfq.mongodb.net/PWA_Store?retryWrites=true&w=majority`, 
  {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
  }
)
.then(_=>console.log('connected to db'))
.catch(error=>console.log(error));


//Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('public'))
app.use(expressLayouts)

app.set('layout', './layouts/main_layout')
app.set('view engine', 'ejs')


const pwaRoutes = require('./src/routes/pwa.routes')

app.use('/', pwaRoutes);

//Routes
app.get('/', (req, res)=>{
    res.render('home')
})

app.get('/detailedView', (req, res)=>{
    res.render('detailedView')
})


//Listen on the specified port
app.listen(PORT, _=>{
    console.log(`Listining on PORT-> ${PORT}`)
})
