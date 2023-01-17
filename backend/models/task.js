const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    waitTime: {
        type: Date,
        default: Date.now() + 30 * 60 * 1000
    },
    status: {
        type: String,
        default: 'Pending'
    },
    escrow: {
        user: {
            type: String,
            default: 'Pending'
        },
        worker: {
            type: String,
            default: 'Pending'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    worker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    finishedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Task', taskSchema);