if(process.env.node.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const flash = require('express-flash')
const session = require('express-session')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const methodOverride = require('method-override')
const { json } = require('express')
var app = express()


//const Authors = require('./models/authors')
//const AuthRoute = require('./controllers/authcontroller')

// mongoose.set('useNewUrlParser', true)
// mongoose.set('useFindAndModify', false)
// mongoose.set('useCreateIndex', true)
// mongoose.set('useUnifiedTopology', true)



//connecting to database
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true,useUnifiedTopology:true})
    
var db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

//setting up docuements
const UserSchema = new mongoose.Schema({
    name:{ 
        type: String,
        required: true
    },
    username:{ 
        type: String,
        required: true
    },
    password:{ 
        type: String,
        required: true
    }
}, {timestamps: true })

const User = mongoose.model('User', UserSchema)

//const intializePassport = require('./passport-config')
// const { authenticate } = require('passport')
// intializePassport(passport, 
//     email => Authors.findOne({email : email}), //user => user.email === email
//     id => Authors.findById(id)//user => user.id == id
// )

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
        done(err, user);
    })
})

passport.use(new localStrategy(function (username, password, done){
    User.findOne({ username: username}, function(err,user){
        //console.log(user)
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

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        console.log("authenticated")
        return next()
    }
    else {
        console.log("not authenticated")
        res.redirect('/login')
    }
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    next()
}

//routes
app.get('/', checkAuthenticated, (req, res)=>{
    res.render('index.ejs', {name: "chonktimus prime"})
})

app.get('/login', checkNotAuthenticated, (req, res)=>{
    res.render('login.ejs')
})

// /
app.post('/login', passport.authenticate('local',{ 
    successRedirect: '/', 
    failureRedirect: '/login?error=true'}))

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

app.post('/register', checkNotAuthenticated, async (req, res)=>{
        const exists = await User.exists({username: req.body.username})
        if(exists){
            res.redirect('/login')
            return
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        console.log(req.body.username)
        const user = new User({
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword
        })
    
        user.save()
        .then((response) =>{
            res.redirect('/login')
            console.log("successfully registered")
        })
        .catch((err) =>{
            console.log(err)
        })
    })
        //     res.redirect('/login')
        // } catch{
        //     res.redirect('/register')
        // }
       

    app.delete('/logout', (req,res) =>{
        req.logOut()
        res.redirect('/login')
    })






//starting server
app.listen(process.env.PORT || 5000)