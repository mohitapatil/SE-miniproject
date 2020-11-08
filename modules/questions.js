const mongoose = require('mongoose')
const validator = require('validator')
const question = mongoose.model('question', {
    text: {
        type: String,
        required: true
    },
    answers: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Answer"
        }
     ],
     tags: [{
        type: Map,
        of: Number,
        default: 0
    }]

})
module.exports = question