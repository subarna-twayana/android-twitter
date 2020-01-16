const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    headingtext: {
        type: String,
    },
    messagetext: {
        type: String,
    },
   userimage: {
        type: String
    },
    messageimage: {
        type: String
    }


});

module.exports = mongoose.model('Tweet', userSchema);