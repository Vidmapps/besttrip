// IMPORTANT
require('dotenv').config();

const express 			= require('express');

const app				= express();
const bodyParser 		= require('body-parser');
const mongoose 			= require('mongoose');
const flash				= require('connect-flash');
const passport 			= require('passport');
const LocalStrategy 	= require('passport-local');
const methodOverride 	= require('method-override');
const expressSanitizer 	= require('express-sanitizer');
const User 				= require('./models/user');
const commentRoutes 	= require('./routes/comments');
const campgroundRoutes 	= require('./routes/campgrounds');
const indexRoutes 		= require('./routes/index');
app.locals.moment 		= require('moment');

//= ==============DATABASE CONFIG======================
// function to run DB locally.
// mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connect('mongodb+srv://vidmantas:desrainis@cluster0-teyia.mongodb.net/test?retryWrites=true&w=majority', {
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to DB!');
}).catch((err) => {
  console.log('ERROR:', err.message);
});
//= ==============DATABASE CONFIG======================

//= ==============PACKAGE CONFIG======================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride('_method'));
app.use(flash());
app.use(expressSanitizer());
app.use(express.static('public')); // use this later for CSS
app.set('view engine', 'ejs');
//= ==============PACKAGE CONFIG======================

//= ==============PASSPORT CONFIG======================
app.use(require('express-session')({
  secret: 'Rusty is the best and cutest dog in the world',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user,
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
//= ==============PASSPORT CONFIG======================


//= =========Travis CI============///
module.exports = {
  add(a, b) {
    return a + b;
  },
};
//= =========Travis CI============///

//IMPORTANT
app.listen(
	//3000
	process.env.PORT, process.env.IP
	, function() {
  console.log('Server listening on port 3000'); 
});
//IMPORTANT