var mongoose = require("mongoose");
 
var answerSchema = new mongoose.Schema({
    text: String,
    upvote: {
        type:Number,
        default: 0
    },
    author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Hospital"
		},
		hospital: String
	}
});
 
module.exports = mongoose.model("Answer", answerSchema);