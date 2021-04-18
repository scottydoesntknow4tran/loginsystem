if(process.env.node.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const mongoose = require('mongoose')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')


const Authors = require('./models/authors')
const AuthRoute = require('./controllers/authcontroller')

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true,useUnifiedTopology:true})
    
var db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))


var users = []


const intializePassport = require('./passport-config')
const { authenticate } = require('passport')
intializePassport(passport, 
    email => Authors.findOne({email : email}), //user => user.email === email
    id => Authors.findById(id)//user => user.id == id
)

app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


app.get('/', (req, res)=>{
    res.render('index.ejs', {name: "bob"})
})

app.get('/login', checkNotAuthenticated, (req, res)=>{
    res.render('login.ejs')
})

// /
app.post('/login', checkNotAuthenticated, AuthRoute.login
//passport.authenticate('local',{ successRedirect: '/', failureRedirect: '/login', failureFlash: true})
)

app.get('/get-all',(req,res)=>{
    Authors.find()
    .then((result)=>{
        res.send(result);
    })
    .catch((err)=>{
        console.log(err)
    })
})

app.get('/get-single',(req, res)=>{
    const user = Authors.findOne({email:'w'})
    .then((user)=>{
        res.send(user);
        console.log(user.email)
        console.log(user.password)
    })
    .catch((err)=>{
        console.log(err)
    })

})

app.get('/register',checkNotAuthenticated, (req, res)=>{
    res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, AuthRoute.register, async (req, res)=>{
    // try{
    //     //const hashedPassword = await bcrypt.hash(req.body.password, 10) 
    //     //AuthRoute.register
    //     // users.push({
    //     //     id: Date.now().toString(),
    //     //     name: req.body.name,
    //     //     email: req.body.email,
    //     //     password: hashedPassword
    //     // })
    //     //res.redirect('/login')
    // } catch{
    //     res.redirect('/register')
    // }
})

app.delete('/logout', (req,res) =>{
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    next()
}

app.listen(process.env.PORT || 5000)