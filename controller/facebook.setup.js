const passport = require('passport'),
  facebookStrategy = require('passport-facebook').Strategy,
  key = require('../key'),
  User = require('../model/user.model');

passport.use(
  new facebookStrategy(
    {
      clientID: key.facebook.client_id,
      clientSecret: key.facebook.client_secret,
      callbackURL: 'http://localhost:3000/auth/facebook/redirect',
      enableProof: true
    },
    (accessToken, refreshToken, profile, cb) => {
      User.findOne({ facebookid: profile.id }).then(currentuser => {
        if (currentuser) {
          cb(null, currentuser);
        } else {
          let newuser = new User();
          newuser.username = profile.displayName;
          newuser.facebookid = profile.id;
          newuser.save().then(thenewuser => {
            cb(null, thenewuser);
          });
        }
      });
    }
  )
);

// Configure Passport authenticated session persistence.
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id).then(user => {
    cb(null, user);
  });
});
