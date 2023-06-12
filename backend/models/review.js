const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker'
    },

    name: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Review', reviewSchema)