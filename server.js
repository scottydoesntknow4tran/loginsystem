if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const https = require('https')
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const Cryptr = require('cryptr')
const mongoose = require('mongoose')
const flash = require('express-flash')
const session = require('express-session')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const methodOverride = require('method-override')
const driver = require('./driver');
const { json } = require('express')
const { name } = require('ejs')
const User = require('./models/users')
const alert = require('alert')
var app = express()

//creating SSL server
const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
},app)

//connecting to database
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true,useUnifiedTopology:true})
    
var db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

//setting up global variable
const cryptr = new Cryptr(process.env.ENCRYPTION_KEY)

let namedb = " "

//middleware
app.set('view-engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//passport
app.use(passport.initialize())
app.use(passport.session())

//passport
passport.serializeUser(function (user, done){
    console.log('serialized')
    done(null,user.id)    
})

passport.deserializeUser(function (id, done){
    console.log('deserialized')
    User.findById(id, function (err, user){
        done(null, user);
    })
})

passport.use(new localStrategy(function (username, password, done){
    User.findOne({ username: username}, function(err,user){
        if(err){return done (err)}
        if(!user){ return done(null, false, {message: "Incorrect Email"})}
        
        bcrypt.compare(password, user.password, function(err, res){
            if (err) return done(err)

            if(res == false){
                return done(null, false, {message:"Incorrect password"})
            }
            return  done(null, user)
        })

    })

})) 

//authentication

function checkCode(req, res, next){
    if(process.env.REGISTRATION_KEY == req.body.code){
        console.log("authenticated")
        return next()
    }
    else {
        console.log("wrong authentication code")
        alert('Incorrect Registraion Code')
        //redirect("/register")
    }
}

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        console.log("authenticated")
        return next()
    }
    else {
        console.log("not authenticated")
    }
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    next()
}

async function findName(req, res){
    const user = await User.findOne({username: req.body.username})
            namedb = await cryptr.encrypt(user.name)
            res.redirect('/')
}

//routes
app.get('/', checkAuthenticated, async (req, res)=>{
    res.render('index.ejs', {name: await cryptr.decrypt(namedb)})
})

app.post('/door',checkAuthenticated, (req, res)=>{
    driver.pulse_relay()})

app.get('/login', checkNotAuthenticated, (req, res)=>{
    res.render('login.ejs')
})

app.post('/login', passport.authenticate('local',{ failureRedirect: '/login?error=true'})
    , findName)

// app.get('/get-all',(req,res)=>{
//     Authors.find()
//     .then((result)=>{
//         res.send(result);
//     })
//     .catch((err)=>{
//         console.log(err)
//     })
// })

// app.get('/get-single',(req, res)=>{
//     const user = Authors.findOne({email:'w'})
//     .then((user)=>{
//         res.send(user);
//         console.log(user.email)
//         console.log(user.password)
//     })
//     .catch((err)=>{
//         console.log(err)
//     })

// })

app.get('/register',checkNotAuthenticated, (req, res)=>{
    res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, checkCode, async (req, res)=>{
        const exists = await User.exists({username: req.body.username})
        if(exists){
            res.redirect('/login')
            return
        }
        try{
        await bcrypt.hash(req.body.password, 12, function(err, hash) {
            const user = new User({
                name: req.body.name,
                username: req.body.username,
                password: hash
            })
        user.save()
        alert("User Created")
        console.log("User stored")
        res.redirect('/login')
        })}
        // await function(err, response) {
        //     res.redirect('/login')
        //     console.log("successfully registered")
        // }}
        catch (err){
            console.log(err)
        }
    })
       

    app.get('/logout', function (req,res){
        req.logout()
        res.redirect('/login')
    })

//starting server
sslServer.listen(process.env.PORT, () => console.log('Secure sever started') )