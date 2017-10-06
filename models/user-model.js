const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const myUserSchema = new Schema(
  {
  fullName: {type: String},
  username: {type: String},

  // SIGN UP/LOG IN FORM USERS ------
  encryptedPassword: {type: String},

  // GOOGLE USERS -------
  googleId: {type: String},

  // FACEBOOK USERS -------
  facebookId: {type: String}
},
{         // 2nd argument -> additional settings  (optional)
  timestamps: true
        // "createdAt" & "updatedAt"
}
);

const UserModel = mongoose.model('users', myUserSchema);


module.exports = UserModel;
