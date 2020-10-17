const mongoose = require('mongoose')
const validator = require('validator')
var passportLocalMongoose = require("passport-local-mongoose"); 
mongoose.set('useCreateIndex', true);
const newHospital = new mongoose.Schema({
    username: {
    type: String,
    // required: true,
    trim: true
    },
    email: {
    type: String,
    trim: true,
    lowercase: true
    },
    address: String,
    Doctors: [
        {
            type:String
        }
    ],
    totalBeds: {
        type: Number,
        // required: true
    },
    availableBeds: {
        type: Number,
        // required: true
    },
    password: {
        type: String,
        // required: true,
        unique: true
    }
    })

// plugin for passport-local-mongoose 
newHospital.plugin(passportLocalMongoose)

module.exports = mongoose.model("Hospital", newHospital)