const passport= require('passport');
const bcrypt = require('bcrypt');

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const UserModel = require('../models/user-model.js');

passport.serializeUser((userFromDb, next) => {
  next(null, userFromDb._id);
});

passport.deserializeUser((idFromBowl, next) => {
  UserModel.findById (
    idFromBowl,

    (err, userFromDb) => {
      if (err) {
        next(err);
        return;
      }
      next(null, userFromDb);
    }
  );
});

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy (
  {
    usernameField: 'loginUsername',
    passwordField: 'loginPassword'
  },
  ( formUsername, formPassword, next ) => {

UserModel.findOne (
      { username: formUsername },

      (err, userFromDb) => {
        if (err){
          next(err);
          return;
        }

        if (userFromDb === null) {
          next(null, false);
          return;
        }
        if (bcrypt.compareSync(formPassword , userFromDb.encryptedPassword) === false) {
          next(null, false);
          return;
        }

        next(null, userFromDb);
      }
    );

  }
));


const FbStrategy = require('passport-facebook').Strategy;

passport.use(new FbStrategy(
  {                         // 1st argument -> callback
    clientID: '120449941895443',
    clientSecret: 'b0a82885bd4cb3d8cc9822b6c143d411',
    callbackURL: '/auth/facebook/callback'
  },

  (accessToken, refreshToken, profile, next) => {
        console.log('');
        console.log('------------  👽 FACEBOOK PROFILE INFO 👽 --------------');
        console.log(profile);
        console.log('');

        UserModel.findOne(
          { facebookId: profile.id },

          (err, userFromDb) => {
            if (err) {
              next(err);
              return;
            }

             if (userFromDb) {
               next(null, userFromDb);
               return;
             }

             const theUser = new UserModel({
               fullName: profile.displayName,
               facebookId: profile.id
             });

             theUser.save((err) => {
               if (err) {
                 next(err);
                 return;
               }
               next(null, theUser);
             });
          }
        );
  }
));

passport.use(new GoogleStrategy(
  {                         // 1st argument -> callback
    clientID: '964805687503-cgvo9cn94f0hrrlk15i4hip7350m1kec.apps.googleusercontent.com',
    clientSecret: 'IaGO_0vi-AlQculUqHtnZ5P6',
    callbackURL: '/auth/google/callback'
  },

  (accessToken, refreshToken, profile, next) => {
        console.log('');
        console.log('------------  🌪 GOOGLE PROFILE INFO 🌪  --------------');
        console.log(profile);
        console.log('');

        UserModel.findOne(
          { googleId: profile.id },

          (err, userFromDb) => {
            if (err) {
              next(err);
              return;
            }

             if (userFromDb) {
               next(null, userFromDb);
               return;
             }

             const theUser = new UserModel({
               fullName: profile.displayName,
               googleId: profile.id
             });

             if (theUser.fullName === undefined) {
               theUser.fullName = profile.emails[0].value;
             }

             theUser.save((err) => {
               if (err) {
                 next(err);
                 return;
               }
               next(null, theUser);
             });
          }
        );
  }
));
