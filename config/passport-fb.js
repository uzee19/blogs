const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy

passport.serializeUser(function(user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
  });
  
  
  passport.use(new FacebookStrategy({
      clientID:"2768407126780205",
      clientSecret:"37315004e7445bd37603e0e9509f342f",
      callbackURL:"http://localhost:3000/users/facebook/callback",
      passReqToCallback:true
    },
    function(request, accessToken, refreshToken, profile, done) {
      console.log(profile)
      return done(null, profile);
    }
  ));