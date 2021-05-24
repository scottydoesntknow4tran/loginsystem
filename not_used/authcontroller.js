const Authors = require('./authors')
const Users = require('../models/users')
const bcrypt = require('bcrypt')
const { response } = require('express')
const passport = require('passport')

const register = async (req, res)=>{
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const user = new Users({
        name: req.body.name,
        email:req.body.email,
        password: hashedPassword
    })
    
    users.save()
    .then((response) =>{
        res.redirect('/login')
        console.log("successfully registered")
    })
    .catch((err) =>{
         console.log(error)
    })
}

// const login = async (req, res) => {
//     var email = req.body.email
//     var password = req.body.password

//     const user = await Authors.findOne({email : email})
//         if(user){
//             var fact = await bcrypt.compare(password, user.password)
//             if(fact){
//                 res.redirect('/')
//                 console.log("successfully logged in")
//             }
//             else{
//                 console.log("unsuccesful login")
//             }
//         }else{
//             console.log("unsuccesful login")
//         }

// }

module.exports = register