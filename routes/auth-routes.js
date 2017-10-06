const express = require('express');


const UserModel = require('../models/user-model.js');
const bcrypt = require('bcrypt');
const router = express.Router();

// REGISTRATION ----------------------------------------------------------

router.get('/signup', (req,res, next) =>{
  if(req.user){
  res.redirect('/');
}
// if not logged in, redirect to log in page.
  else {
    res.render('auth-views/signup-view.ejs');
  }
});
// --------NEW NOTES AND STUFF, COMPARE TO WHAT YOU HAVE VVVVVVVV----------
router.post('/signup', (req,res, next)=> {
  // If username or password are empty
  if (req.body.signupUsername === '' || req.body.signupPassword === ''){
    // If either of them it true, display an error to the user
    res.locals.messageForUsers = 'Please provide both username and password, Dumbass';

    res.render('auth-views/signup-view.ejs');
    return;
  }
  // Otherwise, check to see if the submitted username is taken
  UserModel.findOne(
    {username: req.body.signupUsername},
    (err, userFromDb) => {
      // Just in case there is some random DB query error VVVVV
      if(err){
        next(err);
        return;
      }
      // ^^^^^^^^^-------------------^^

      // If the username is taken, the "userFromDb" variable will have a result

      // Check if 'userFromDb' is not empty
      if (userFromDb){
        // If that's the case (userFromDb is not empty), display an error to the user
        res.locals.messageForUsers = 'Sorry that username is taken.';

        res.render('auth-views/signup-view.ejs');
        return;
      }
      // If we get here, we are ready to save the new user in the DB.
      const salt = bcrypt.genSaltSync(10);
      const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);

        const theUser = new UserModel({
          fullName: req.body.signupFullName,
          username: req.body.signupUsername,
          encryptedPassword: scrambledPassword
        });

        theUser.save((err)=>{
          if (err){
            next(err);
            return;
          }
          // redirect to home if registration is SUCCESSFUL
          res.redirect('/');
        });
    }
  );
//---------NEW NOTES AND STUFF, COMPARE TO WHAT YOU HAVE ^^^^^^^^^^----------

});
// END REGISTRATION ---------------------------------------------------

const passport = require('passport');

// LOG IN --------------------------------------------------
router.get('/login', (req,res, next)=>{
  if(req.user){
  res.redirect('/');
}
// if not logged in, redirect to log in page.
  else {
    res.render('auth-views/login-view.ejs');
  }
});

router.post('/login', passport.authenticate(
  "local",  // 1st argument -> name of the strategy (determined by the strategy's npm package)
  {    //  2nd argument -> settings object
    successRedirect:   "/" , // "successRedirect" (where to go if login worked)
    failureRedirect: "/login" // "failureRedirect" (where to go if login failed)
  }
));


// END LOG IN ----------------------------------------------


router.get('/logout', (req, res, next)=>{
  // the 'req.logout()' function is defined by the passport middleware (app.js)
  req.logout();
  res.redirect('/');
});


// SOCIAL LOGINS ----------

                                  // determined by the strategy's npm package
                                  //                    |
router.get('/auth/facebook', passport.authenticate('facebook'));
          // GO HERE to login in with Facebook

// when you come back from Facebook you go HERE
//                    |
router.get('/auth/facebook/callback',
  passport.authenticate(
    'facebook',   // 1st argument -> name of the strategy
    {             // 2nd argument -> settings object
      successRedirect: '/special',
      failureRedirect: '/login'
    }
  )
);




router.get('/auth/google',
passport.authenticate(
  'google',
  {
    scope: [
      'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/plus.profile.emails.read'
    ]
  }
));
          // GO HERE to login in with Google

// when you come back from Google you go HERE
//                    |
router.get('/auth/google/callback',
  passport.authenticate(
    'google',   // 1st argument -> name of the strategy
    {             // 2nd argument -> settings object
      successRedirect: '/special',
      failureRedirect: '/login'
    }
  )
);
// END SOCIAL LOGINS ---------------------




















module.exports = router;
