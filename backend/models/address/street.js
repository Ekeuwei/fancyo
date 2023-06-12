const mongoose = require('mongoose')

const streetSchema = mongoose.Schema({
    name: {
        type: String,
        required: true 
    },
    sn: {
        type: String,
        unique: true
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
    },
})


module.exports = mongoose.model('Street', streetSchema);