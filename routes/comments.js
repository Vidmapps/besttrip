var express 	= require("express");
var router 		= express.Router({mergeParams:true});
var Campground 	= require("../models/campground");
var Comment 	= require("../models/comment");
var middleware 	= require("../middleware");


//NEW Route - to GET show form
router.get("/new", middleware.isLoggedIn, function(req, res){
	//find based on ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			//Show based on ID
			res.render("comments/new", {campground: campground});
		}
	});
});

//SEND Route - to POST the comment
router.post("/", middleware.isLoggedIn, function(req, res){
	//lookup based on ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong");	
					console.log(err);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully added comment");	
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

//EDIT Route - GET the data to update
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			console.log(err);
			res.redirect("back");
		} else {
		//Show based on ID
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

//UPDATE Route - PUT the data to update
router.put("/:comment_id/", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
				res.redirect("back");
		} else {
		//Show based on ID
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DELETE Route - DELETE the data
router.delete("/:comment_id/", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
				res.redirect("back");
			} else {
				req.flash("success", "Successfully deleted comment");	
				res.redirect("back");
		}});
	});


/*//midleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function checkCommentOwnership(req, res, next){
	if(req.isAuthenticated()){		
		Comment.findById(req.params.comment_.id, function(err, foundComment){
			if(err){
				res.redirect("back");
			} else {
				//does user own the comment?
				if(foundComment.author.id.equals(req.user._id)){
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