const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    title:{
        type: String
    },
    location: {
        state: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'State'
        },
        lga: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lga'
        },
        town: {
            type: String,
            required: true
        }
    },
    description: {
        type: String,
        required: true
    },
    numberOfWorkers: {
        type: Number,
        default: 1
    },
    summary: {
        type: String
    },
    budget: {
        type: Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        default: 'Pending'
    },
    workers: [
        {
            worker: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Worker'
            },
            escrow: {
                user: {
                    enum: ['Pending', 'Cancelled', 'Completed'],
                    type: String,
                    default: 'Pending'
                },
                worker: {
                    enum: ['Pending', 'Declined', 'Completed', 'Accepted','Abandoned'],
                    type: String,
                    default: 'Pending'
                }
            },
            review: mongoose.Schema.Types.ObjectId
        }
    ],
    applicants:{
        type: [
            {
                worker: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Worker'
                },
                message: String
            }
        ],
        // select: false
    },
    review: mongoose.Schema.Types.ObjectId,
    finishedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Task', taskSchema);