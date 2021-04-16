const Authors = require('../models/authors')
const bcrypt = require('bcrypt')

const register = (req, res)=>{
    const hashedPassword = bcrypt.hash(req.body.password, 10)

    const authors = new Authors({
        name: req.body.name,
        email:req.body.email,
        hashedpassword: hashedPassword
    })
    
    authors.save()
    .then(((response) =>{
    res.redirect('/login')
    console.log("successful")
    })
    // .catch((err) =>{
    //     console.log(error)})
    )
}

module.exports = {register}