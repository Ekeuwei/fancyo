const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    title:{
        type: String
    },
    taskId:{
        type: String,
        unique: true
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
    rate:{
        value: {
            type: Number,
            default: 2000,
            min: [2000, 'The minimum rate on the platform is ₦2,000'],
            required: true
        },
        agreed: {
            type: Boolean,
            default: false
        },
        postedBy:{
            type: String,
            default: 'owner',
            enum: ['owner', 'worker']
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Request', 'Pending', 'Cancelled', 'Declined', 'Completed', 'Accepted','Abandoned'],
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
                message: {
                    type: String,
                    default: "Sure, I'd be happy to take on the job!"
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                }
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

taskSchema.pre('save', async function(){
    if(this.isNew){
        this.taskId = await this.constructor.generateNextTaskId();
    }
})

taskSchema.statics.generateNextTaskId = async function () {
  const lastTask = await this.findOne().sort({ taskId: -1 });
  return lastTask? (parseInt(lastTask.taskId) + 1).toString() : "1000";
};

module.exports = mongoose.model('Task', taskSchema);