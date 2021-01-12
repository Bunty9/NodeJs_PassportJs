const router = require('express').Router();
const bcrypt = require('bcrypt')
const passport = require('passport')
const User = require('./models/user_model')
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => User.find(user => user.email === email),
  id => User.find(user => user.id === id)
)

router.route('/').get( (req, res)=>{
    res.render('index.ejs')
});

router.route('/').post( (req, res)=>{
    res.render('login.ejs')
});

router.route('/register').get( (req, res)=>{
    res.render('register.ejs')
});
router.route('/register').post(async (req, res)=>{
    
    // hash the passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    try{
        console.log(req.body);
        const user = new User({
        username:req.body.username,
        password:hashedPassword,
        email:req.body.email,
        }); 
        await user.save();
        res.send({user: user._id});
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }
module.exports = router;

