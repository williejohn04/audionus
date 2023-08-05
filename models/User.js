const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  profilePicture: {
    type: String
  }
});
UserSchema.plugin(passportLocalMongoose, {usernameQueryFields: ["email"]});
const User = mongoose.model('User', UserSchema);
module.exports = User;