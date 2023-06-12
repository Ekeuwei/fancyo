const mongoose = require('mongoose');

const stateSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sn: {
        type: String,
        required: true
    }
})

stateSchema.pre('save', async function(){
    if(this.isNew){
        this.sn = await this.constructor.generateNextSn();
    }

    next();
})

stateSchema.pre('insertMany', async function(next, docs){

    const lastState = await this.findOne().sort({ sn: -1 });
    let nextSn = lastState ? (parseInt(lastState.sn) + 1).toString() : '01';
    
    docs.forEach((doc) => {
        doc.sn = nextSn;
        nextSn = (parseInt(nextSn) + 1).toString().padStart(2, '0');
    });

    next();
})

stateSchema.statics.generateNextSn = async function () {
  const state = await this.findOne().sort({ sn: -1 });
  return state? (parseInt(state.sn) + 1).toString().padStart(2, '0') : '01';
};

module.exports = mongoose.model('State', stateSchema)