const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getuserByEmail, getuserById){
    const authenticateUser = async (email, password, done) => {
        const user = getuserByEmail(email)
        if(user == null){
            return done(null, false, {message: 'Invalid email' })
        }
        try {
            if (await bcrypt.compare(password, user.password)){
                return done(null, user)
            }
            else{
                return done(null, false, { message: 'Password Incorrect'})
            }
        } catch (error) {
            return done(error)
        }
    }
    passport.use(new LocalStrategy({usernameField: 'email'},authenticateUser))
    passport.serializeUser((user, done) => {done(null, user.id) })
    passport.deserializeUser((id, done) => {
        return done(null,getuserById)
     })
}
module.exports = initialize