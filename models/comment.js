var mongoose = require("mongoose");


//SCHEMA SETUP
var commentSchema = new mongoose.Schema({
	text: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});
var Comment = mongoose.model("Comment", commentSchema);
module.exports = mongoose.model("Comment", commentSchema);

//SCHEMA SETUP
