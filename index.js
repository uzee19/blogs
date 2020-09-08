const express= require('express');
const app= express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Article = require('./models/article')
const articlerouter = require('./routes/articles')
const methodOverride = require('method-override')
const url = 'mongodb://localhost/passport';
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const multer = require('multer');





mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/blog',{useUnifiedTopology: true, useNewUrlParser: true , useCreateIndex: true })

dotenv.config();

const cookieSession = require('cookie-session')

app.use(express.urlencoded({ extended: false}))
app.use(methodOverride('_method'))



// For an actual app you should configure this with an experation time, better keys, proxy and secure
app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
  }))

// Passport Config
require('./config/passport')(passport);
require('./config/passport-setup');
require('./config/passport-fb');

app.use(passport.initialize());
app.use(passport.session());


//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

// Passport Middleware
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables (to display messages with diff colours)
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });


// Import Routes
authRoute= require('./routes/auth');
postRoute = require('./routes/posts');
indexRoute = require('./routes/home');

//CORS
app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept, Authorization"
  );
  if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods','PUT', 'PATCH', 'EDIT', 'POST', 'DELETE')
    return res.status(200).json({});
  }
  next();
});


mongoose.connect(process.env.MONGODB_URI || url,{useNewUrlParser:true,useUnifiedTopology: true});     // useNewUrlParser --> removes warning messages
const con = mongoose.connection;

con.on('open',function(){               // to check if its connected to server 
    console.log('connected...');
});

//Middlewares


//Body-parser
app.use(express.urlencoded({extended: false}));

// Route middleware

app.use('/users',authRoute);
app.use('/posts',postRoute);
app.use('/',indexRoute);


app.get('/blogshome', async (req,res) => {
  const articles =  await Article.find().sort({createdAt: 'desc'})
  res.render('articles/index',{articles:articles} )

}) 
app.use('/articles', articlerouter)





const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>(console.log(`Server running... ${PORT}`)));
