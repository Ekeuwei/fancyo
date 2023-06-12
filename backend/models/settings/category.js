const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: String,
    sn: {
        type: String,
        required: true
    }
})

categorySchema.pre('save', async function(){
    if(this.isNew){
        this.sn = await this.constructor.generateNextSn();
    }

    next();
})

categorySchema.statics.generateNextSn = async function () {
  const category = await this.findOne().sort({ sn: -1 });
  return category? (parseInt(category.sn) + 1).toString().padStart(2, '0') : '01';
}

module.exports = mongoose.model('Category', categorySchema);