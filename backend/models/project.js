const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: String,
    uniqueId: {
        type: String,
        unique: true
    },
    punter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: {
        type: String,
    },
    budget: { 
        type: Number, 
        required: true 
    },
    eRoi: { 
        type: Number, 
        required: true 
    },
    availableBalance: { 
        type: Number, 
        default: 0
    },
    roi: {
        type: Number,
    },
    contributors: [
        {
            userId: { 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            amount: {
                type: Number,
                required: true
            },
            status: {
                type: String,
                enum: ['pending', 'settled', 'lost'],
                default: 'pending'
            }
        }
    ],
    status: {
        type: String,
        enum: ['pending', 'in progress', 'failed'],
        default: 'pending'
    },
    balanceBefore: {
        type: Number,
    },
    balanceAfter: {
        type: Number,
    },
    startAt:{
        type: Date,
    },
    endAt:{
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

projectSchema.pre('save', async function(){
    if (!this.uniqueId) {
        this.uniqueId = await this.constructor.generateNextId();
    }
})

projectSchema.statics.generateNextId = async function () {
  const lastProject = await this.findOne().sort({ uniqueId: -1 });
  return lastProject? (parseInt(lastProject.uniqueId) + 1).toString() : "1178";
};

module.exports = mongoose.model('Project', projectSchema);