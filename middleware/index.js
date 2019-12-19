var Campground 		= require("../models/campground");
var Comment 		= require("../models/comment");

var middlewareObj 	= {};

middlewareObj.checkCampgroundOwnership = function (req, res, next){
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
					req.flash("error", "You need to own the comment to do that");	
					//otherwise redirect
					res.redirect("back");
			}
		};
	});
	req.params.id
	} else {
		req.flash("error", "You need to be logged in to do that");	
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){		
		Comment.findById(req.params.comment_.id, function(err, foundComment){
			if(err){
				req.flash("error", "Campground not found");
				res.redirect("back");
			} else {
				//does user own the comment?
				if(foundComment.author.id.equals(req.user._id)){
					//Show based on ID
					next();
				} else {
					req.flash("error", "You do not have permsission to do that");	
					//otherwise redirect
					res.redirect("back");
			}
		};
	});
	req.params.id
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
};	

middlewareObj.isLoggedIn = function (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
};


module.exports = middlewareObj;