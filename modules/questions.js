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
     ]

})
module.exports = question