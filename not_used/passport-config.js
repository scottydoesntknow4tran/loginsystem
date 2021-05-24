//this file is not used

const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const Author = require('./authors')
const AuthRoute = require('./authcontroller')


function intialize(passport, getUserByEmail, getUserByID){
//    const authenticateUser = async (email, password, done)=>{
//         const user = getUserByEmail(email)
//         await console.log(user)
//         if(user == null){
//             return done(null, false, { message: 'Invalid email or password'})
//         }    
//         else if(user){
//         try{
//             if(await bcrypt.compare(password, user.password)){
//                 return done(null, user)
//             }
//             else{
//                 return done(null, false, {message: 'Invalid email or password'})
//             }
//         } catch(e) {
//             return done(e)
//         }
//         }   
//         else{
//             return done(null, false, {message: 'Invalid email or password'})
//         }

//     }

    // passport.use(new LocalStrategy(function (username, password, done){
    //     Author.findOne({ username: 'email'}, function(err,user){
    //         if(err){return done (err)}
    //         if(!user){ return done(null, false, {message: "Incorrect Username"})}
            
    //         bcrypt.compare(password, user.password, function(err, res){
    //             if (err) return done(err)

    //             if(res == false){
    //                 return done(nul, false, {message:"Incorrect password"})
    //             }
    //             return done(null, user)
    //         })

    //     })

    // })) // 'password' is the default value passed in, so we dont need it

    // passport.serializeUser((user, done)=> done(null,user.id)) //saving user
    // passport.deserializeUser(function (id, done){
    //     Author.findById(id, function (err, user){
    //         done(err, user); //setup s
    //     })
    // })
        


}

module.exports = intialize