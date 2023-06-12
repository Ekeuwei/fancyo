const mongoose = require("mongoose");

const lgaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sn: {
        type: String,
        unique: true
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'State'
    }
})

lgaSchema.pre('save', async function(){
    if(this.isNew){
        this.sn = await this.constructor.generateNextSn();
    }

    next();
})

lgaSchema.pre('insertMany', async function(next, docs){

    const lastLga = await this.findOne().sort({ sn: -1 });
    let nextSn = lastLga ? (parseInt(lastLga.sn) + 1).toString() : '001';
    
    docs.forEach((doc) => {
        doc.sn = nextSn;
        nextSn = (parseInt(nextSn) + 1).toString().padStart(3, '0');
    });

    next()
})

lgaSchema.statics.generateNextSn = async function () {
  const lga = await this.findOne().sort({ sn: -1 });
  return lga? (parseInt(lga.sn) + 1).toString().padStart(3, '0') : '001';
};

module.exports = mongoose.model('Lga', lgaSchema)