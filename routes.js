// GNU GENERAL PUBLIC LICENSE
// Version 3, 29 June 2007

// Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
// Everyone is permitted to copy and distribute verbatim copies
// of this license document, but changing it is not allowed.

//      Preamble

// The GNU General Public License is a free, copyleft license for
// software and other kinds of works.


const router = require('express').Router();
const bcrypt = require('bcrypt')
const passport = require('passport')
const User = require('./models/user_model')
const initializePassport = require('./passport-config')

initializePassport(
  passport,
  email => User.findOne(users => User.email === email),
  id => User.findById(users => User.id === id)
)

router.route('/').get( checkAuthenticated,(req, res)=>{
  res.render('index.ejs')
});

router.route('/login').get(checkNotAuthenticated, (req, res)=>{
    res.render('login.ejs')
});

router.route('/login').post( checkNotAuthenticated,passport.authenticate('local', {
  successRedirect: '/api',
  failureRedirect: '/api/login',
  failureFlash: true
}))

router.route('/register').get(checkNotAuthenticated, (req, res)=>{
    res.render('register.ejs')
});
router.route('/register').post(checkNotAuthenticated, async (req, res)=>{
    
    // hash the passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    try{
        const user = new User({
        username:req.body.username,
        password:hashedPassword,
        email:req.body.email,
        }); 
        await user.save();
        // res.send({user: user._id});
        res.redirect('/api/login')
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.route('/logout').delete( (req, res) => {
  req.logOut()
  res.redirect('/api/login')
})

// check if the user is authenticated if not redirect to login , this to block unauthenticated users from accessing the home page
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/api/login')
}
// if the user is authenticated redirect to home page if the login/register page is accessed again
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/api')
    }
    next()
  }
module.exports = router;

