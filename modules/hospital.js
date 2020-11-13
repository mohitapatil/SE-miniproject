const mongoose = require('mongoose')
const validator = require('validator')
var passportLocalMongoose = require("passport-local-mongoose"); 
mongoose.set('useCreateIndex', true);
const newHospital = new mongoose.Schema({
    username: {
    type: String,
    required: true,
    unique:true,
    trim: true
    },
    price: {
        type:Number
    },
    email: {
    type: String,
    trim: true,
    lowercase: true
    },
    address: String,
    booking: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "booking"
        }
     ],
    totalBeds: {
        type: Number,
        // required: true
    },
    availableBeds: {
        type: Number,
        // required: true
    }
    })

// plugin for passport-local-mongoose 
newHospital.plugin(passportLocalMongoose)

module.exports = mongoose.model("Hospital", newHospital)