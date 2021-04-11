const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')


function intialize(passport, getUserByEmail, getUserByID){
   const authenticateUser = async (email, password, done)=>{
    const user = getUserByEmail(email)
    if(user == null){
        return done(null, false, { message: 'Invalid email or password'})
    }    

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

    passport.use(new LocalStrategy({ usernameField: 'email'}, authenticateUser)) // 'password' is the default value passed in, so we dont need it
    passport.serializeUser((user, done)=> done(null,user.id))
    passport.deserializeUser((id, done)=> done(null, getUserByID(id)))


}

module.exports = intialize