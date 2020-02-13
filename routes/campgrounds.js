var express 	= require("express");
var router 		= express.Router();
var Campground 	= require("../models/campground");
var middleware 	= require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);



//INDEX Route - to GET show all content
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
       }
    });
});
	
//CREATE Route - to POST data
router.post("/", middleware.isLoggedIn, function(req, res){
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	geocoder.geocode(req.body.location, function (err, data) {
	  if (err || !data.length) {
		req.flash('error', 'Invalid address');
		console.log(err)
		return res.redirect('back');
	  }
	  var lat = data[0].latitude;
	  var lng = data[0].longitude;
	  var location = data[0].formattedAddress;
	  var newCampground = {name: name, image: image, description: desc, price: price, author:author, location: location, lat: lat, lng: lng};
	  // Create a new campground and save to DB
	  Campground.create(newCampground, function(err, newlyCreated){
		  if(err){
			  console.log(err);
		  } else {
			  //redirect back to campgrounds page
			  console.log(newlyCreated);
			  res.redirect("/campgrounds");
		  }
	  });
	});
  });

//NEW Route - to GET show form
router.get("/new", middleware.isLoggedIn, function(req, res){ //GETting the form to add
	res.render("campgrounds/new");
});

//SHOW Route - to GET show more about an item
router.get("/:id", function(req, res){
	//find based on ID
	Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
		if(err){
			console.log("Please check and try again");
			console.log(err);
		} else {
			//Show based on ID
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
	req.params.id
});

//EDIT Route - GET the data to update
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
		Campground.findById(req.params.id, function(err, foundCampground){
			//Show based on ID
			res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//UPDATE Route - PUT the data to update
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	geocoder.geocode(req.body.location, function (err, data) {
	  if (err || !data.length) {
		req.flash('error', 'Invalid address');
		return res.redirect('back');
	  }
	  req.body.campground.lat = data[0].latitude;
	  req.body.campground.lng = data[0].longitude;
	  req.body.campground.location = data[0].formattedAddress;
  
	  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
		  if(err){
			  req.flash("error", err.message);
			  res.redirect("back");
		  } else {
			  req.flash("success","Successfully Updated!");
			  res.redirect("/campgrounds/" + campground._id);
		  }
	  });
	});
  });

//DELETE Route - DELETE the data
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
				res.redirect("/campgrounds")
			} else {
				res.redirect("/campgrounds");
		}});
	});


/*//midleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

function checkCampgroundOwnership(req, res, next){
	if(req.isAuthenticated()){		
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				res.redirect("back");
			} else {
				//does user own the campground?
				if(foundCampground.author.id.equals(req.user._id)){
					//Show based on ID
					next();
				} else {
					//otherwise redirect
					res.redirect("back");
			}
		};
	});
	req.params.id
	} else {
		res.redirect("back");
	}
};
*/
module.exports = router;