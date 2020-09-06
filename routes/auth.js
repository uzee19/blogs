const router = require('express').Router();
const User = require('../models/user');
const {registerValidation,loginValidation} = require('../validation');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');


const { forwardAuthenticated } = require('../config/authentication');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

router.get('/',async(req,res) => {
    try{
            const users = await User.find()
            res.json(users)           

    }catch(err){
        res.send('Error' + err) //if we get error
    }
});  
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
  
    if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (errors.length > 0) {
      res.status(400).render('register', {
        errors,
        name,
        email,
        password,
        password2
      });
    } else {
      User.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: 'Email already exists' });
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            name,
            email,
            password
          });
          // Hash password
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  );
                  res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
  });

 router.delete('/delete/:id',async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        
        const a1 = await user.remove()
        res.json(a1)

    }catch(err){
        res.send('Error')
    }
});



// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: 'http://localhost:3000/blogshome',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/welcome');
});

const isLoggedIn = (req, res, next) => {
  if (req.user) {
      next();
  } else {
      res.sendStatus(401);
  }
}

router.get('/success',isLoggedIn,(req,res)=>{
  res.redirect("http://localhost:3000/blogshome")
  
});

router.get('/google',passport.authenticate('google',{ scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:3000/welcome' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/users/success');

  }
);

router.get('/facebook',
  passport.authenticate('facebook'));

  router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:3000/blogshome');
    
  });





	




module.exports = router;