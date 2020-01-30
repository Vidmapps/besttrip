var express 	= require("express");
var router 		= express.Router();
var Campground 	= require("../models/campground");
var middleware 	= require("../middleware");



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
router.post("/", middleware.isLoggedIn, function(req, res){ //POSTting new campground
	//get data from campground and put into its array
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, price: price, image: image, description: description, author: author};
	Campground.create(newCampground, function(err, allcampgrounds){
		if(err){
			console.log(err);
		} else {						
			//redirect to campgrounds page
			res.redirect("/campgrounds"); 
		}
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
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){ //ka stumti, i kur
		if(err){
				res.redirect("/campgrounds")
			} else {
				res.redirect("/campgrounds/" + req.params.id);
			}});
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