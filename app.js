//IMPORTANT
var express 				= require("express");
var app						= express();
var bodyParser 				= require("body-parser");
var mongoose 				= require("mongoose");
var flash					= require("connect-flash")
var seedDB 					= require("./seeds");
var passport 				= require("passport");
var User 					= require("./models/user");
var LocalStrategy 			= require("passport-local");
var passportLocalMongoose 	= require("passport-local-mongoose");
var methodOverride 			= require("method-override");
var Campground 				= require("./models/campground");
var Comment 				= require("./models/comment");

var commentRoutes 			= require("./routes/comments");
var campgroundRoutes 		= require("./routes/campgrounds");
var indexRoutes 			= require("./routes/index");
var expressSanitizer 		= require("express-sanitizer");




//var User = require("./models/user");
//var request = require("request");
//seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use (bodyParser.urlencoded({extended:true}));
app.use (express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(expressSanitizer());
app.use(express.static("public")); //use this later for CSS
app.set ("view engine", "ejs");
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
//IMPORTANT



//IMPORTANT
app.listen(3000, function() { 
  console.log('Server listening on port 3000'); 
});
//IMPORTANT

//DB rules
/*
	1. show dbs
	2. use //db name//
	3. show collections
	4. db.//collection name//.find()//
*/
