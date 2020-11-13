var mongoose = require("mongoose");

var schema = new mongoose.Schema({
	toHospital: {type: mongoose.Schema.Types.ObjectId, ref: "hospital"},
	name: {type: String,required: true},
	address: { type: String, required: true},
	paymentId: {type: String,required:true}
});

module.exports = mongoose.model("Booking", schema);