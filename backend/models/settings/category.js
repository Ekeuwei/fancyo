const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: String,
    image: {
        public_id:{
            type: String,
            default: "category_icon_y5r7ou"
        },
        url:{
            type: String,
            default: "https://res.cloudinary.com/rveasy-technologies-limited/image/upload/v1688113667/category/category_icon_y5r7ou.jpg"
        }
    },
    sn: {
        type: String
    }
})

categorySchema.statics.generateNextSn = async function () {
  const category = await this.findOne().sort({ sn: -1 });
  return category? (parseInt(category.sn) + 1).toString().padStart(2, '0') : '01';
}

categorySchema.pre('save', async function(next){
    if(this.isNew){
        this.sn = await this.constructor.generateNextSn();
    }
    next();
})



module.exports = mongoose.model('Category', categorySchema);