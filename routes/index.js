const express 	= require('express');

const router 		= express.Router();



// Default Route
router.get('/', (_req, res) => { // Search Input page
  res.render('landing');
});


module.exports = router;
