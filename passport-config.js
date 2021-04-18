const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const Authors = require('./models/authors')
const AuthRoute = require('./controllers/authcontroller')


function intialize(passport, getUserByEmail, getUserByID){
   const authenticateUser = async (email, password, done)=>{
        const user = getUserByEmail(email)
        await console.log(user)
        if(user == null){
            return done(null, false, { message: 'Invalid email or password'})
        }    
        else if(user){
        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            }
            else{
                return done(null, false, {message: 'Invalid email or password'})
            }
        } catch(e) {
            return done(e)
        }
        }   
        else{
            return done(null, false, {message: 'Invalid email or password'})
        }

}

    passport.use(new LocalStrategy({ usernameField: 'email'}, authenticateUser)) // 'password' is the default value passed in, so we dont need it
    passport.serializeUser((user, done)=> done(null,user.id))
    passport.deserializeUser((id, done)=> done(null, getUserByID(id)))


}

module.exports = intialize