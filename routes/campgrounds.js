const express = require('express');

const router 		    = express.Router();
const NodeGeocoder  = require('node-geocoder');
const Campground 	  = require('../models/campground');
const middleware 	  = require('../middleware');

const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
};

const geocoder = NodeGeocoder(options);


// INDEX Route - to GET show all content
router.get('/', (_req, res) => {
  // Get all campgrounds from DB
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campgrounds: allCampgrounds, page: 'campgrounds' });
    }
  });
});

// CREATE Route - to POST data
router.post('/', middleware.isLoggedIn, (req, res) => {
  // get data from form and add to campgrounds array
  const { name } = req.body;
  const { image } = req.body;
  const { price } = req.body;
  const desc = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };
  geocoder.geocode(req.body.location, (err, data) => {
	  if (err || !data.length) {
      req.flash('error', 'Invalid address');
      console.log(err);
      return res.redirect('back');
	  }
	  const lat = data[0].latitude;
	  const lng = data[0].longitude;
	  const location = data[0].formattedAddress;
	  const newCampground = {
      name, image, description: desc, price, author, location, lat, lng,
    };
	  // Create a new campground and save to DB
	  Campground.create(newCampground, (err, newlyCreated) => {
		  if (err) {
			  console.log(err);
		  } else {
			  // redirect back to campgrounds page
			  console.log(newlyCreated);
			  res.redirect('/campgrounds');
		  }
	  });
  });
});

// NEW Route - to GET show form
router.get('/new', middleware.isLoggedIn, (_req, res) => { // GETting the form to add
  res.render('campgrounds/new');
});

// SHOW Route - to GET show more about an item
router.get('/:id', (req, res) => {
  // find based on ID
  Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      // Show based on ID
      res.render('campgrounds/show', { campground: foundCampground });
    }
  });
  req.params.id;
});

// EDIT Route - GET the data to update
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (_err, foundCampground) => {
    // Show based on ID
    res.render('campgrounds/edit', { campground: foundCampground });
  });
});

// UPDATE Route - PUT the data to update
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  geocoder.geocode(req.body.location, (err, data) => {
	  if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
	  }
	  req.body.campground.lat = data[0].latitude;
	  req.body.campground.lng = data[0].longitude;
	  req.body.campground.location = data[0].formattedAddress;

	  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
		  if (err) {
			  req.flash('error', err.message);
			  res.redirect('back');
		  } else {
			  req.flash('success', 'Successfully Updated!');
			  res.redirect(`/campgrounds/${campground._id}`);
		  }
	  });
  });
});

// DELETE Route - DELETE the data
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;
