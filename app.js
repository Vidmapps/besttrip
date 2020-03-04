//IMPORTANT
require('dotenv').config();

const express 					= require("express"),
app											= express(),
bodyParser 							= require("body-parser"),
mongoose 								= require("mongoose"),
flash										= require("connect-flash"),
passport 								= require("passport"),
User 										= require("./models/user"),
LocalStrategy 					= require("passport-local"),
methodOverride 					= require("method-override"),
commentRoutes 					= require("./routes/comments"),
campgroundRoutes 				= require("./routes/campgrounds"),
indexRoutes 						= require("./routes/index"),
expressSanitizer 				= require("express-sanitizer");
app.locals.moment 			= require('moment');

//===============DATABASE CONFIG======================
//mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect("mongodb+srv://vidmantas:desrainis@cluster0-teyia.mongodb.net/test?retryWrites=true&w=majority", {
	useNewUrlParser: true, 
	useUnifiedTopology: true,
	useCreateIndex: true
}).then (() => {
	console.log("Connectect to DB!");
}).catch(err => {
	console.log('ERROR:', err.message);
});
//===============DATABASE CONFIG======================

//===============PACKAGE CONFIG======================
app.use (bodyParser.urlencoded({extended:true}));
app.use (express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(expressSanitizer());
app.use(express.static("public")); //use this later for CSS
app.set ("view engine", "ejs");
//===============PACKAGE CONFIG======================

//===============PASSPORT CONFIG======================
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next){
	res.locals.currentUser = req.user,
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next()
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
//===============PASSPORT CONFIG======================


//==========Travis CI============///
module.exports = {
	add: function (a, b) {
			return a + b;
	}
};
//==========Travis CI============///


//IMPORTANT
app.listen(
	//3000
	process.env.PORT, process.env.IP
	, function(){
  console.log('Server listening on port 3000'); 
});
//IMPORTANT


