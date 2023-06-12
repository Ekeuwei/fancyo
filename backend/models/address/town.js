const mongoose = require('mongoose')

const townSchema = mongoose.Schema({
    name: {
        type: String,
        required: true 
    },
    postalCode: {
        type: String
    },
    lga: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lga'
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State'
    }
})


module.exports = mongoose.model('Town', townSchema);