const mongoose = require('mongoose')
const validator = require('validator')
const Hospital = mongoose.model('hospital', {
    name: {
    type: String,
    required: true,
    trim: true
    },
    email: {
    type: String,
    trim: true,
    lowercase: true
    },
    totalBeds: {
        type: Number,
        required: true
    },
    availableBeds: {
        type: Number,
        // required: true
    },
    password: {
        type: String,
        required: true
    }
    })
module.exports = Hospital