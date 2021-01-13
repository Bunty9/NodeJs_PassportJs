const localStrategy = require('passport').Strategy
const bcrypt =require('bcrypt')


function initialize(passport, getUserByEmail, getUserById) {
    
    const authenticateUser = async (email, password, done) => {
      const user = getUserByEmail(email)
      if (user == null) {
        return done(null, false, { message: 'No user with that email found' })
      }
  
      try {
        if (await bcrypt.compare(password, user.password)) {
          return done(null, user)
        } else {
          return done(null, false, { message: 'Password incorrect' })
        }
      } catch (e) {
        return done(e)
      }
    }
  
    var newinsatance = new localStrategy({ usernameField: 'email' });

    passport.use(newinsatance, authenticateUser)
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
      return done(null, getUserById(id))
    })
  }
  
  module.exports = initialize