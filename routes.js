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

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/api/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/api')
    }
    next()
  }
module.exports = router;

