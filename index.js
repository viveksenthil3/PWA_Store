const express = require('express')
const expressLayouts = require('express-ejs-layouts')

const app = express()
const PORT = process.env.PORT || 5000

//Middlewares
app.use('/static', express.static('public'))
app.use(expressLayouts)

app.set('layout', './layouts/main_layout')
app.set('view engine', 'ejs')


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