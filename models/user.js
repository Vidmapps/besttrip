const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


// SCHEMA SETUP
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

// SCHEMA SETUP
