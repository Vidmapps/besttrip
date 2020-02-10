var mongoose 				= require("mongoose");
var passportLocalMongoose 	= require("passport-local-mongoose");


//SCHEMA SETUP
var UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", UserSchema);
module.exports = mongoose.model("User", UserSchema);

//SCHEMA SETUP
