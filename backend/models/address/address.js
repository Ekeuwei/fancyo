const mongoose = require('mongoose')

const addressSchema = mongoose.Schema({
    name: {
        type: String,
        required: true 
    },
    town: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Town"
    },
    lga: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lga"
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State"
    }
})

module.exports = mongoose.model('Address', addressSchema);