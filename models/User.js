var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var UserSchema = new mongoose.Schema({
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
var User = mongoose.model('User', UserSchema);
module.exports = User;