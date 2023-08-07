const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  displayName: {
    type: String,
    maxlength: [20, "Your display name cannot exceed 20 characters"],
  },
  owner:{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  featuredGraphics: {
    public_id: {
      type: String,
      // required: true
    },
    url: {
      type: String,
      // required: true
    },
  },
  uniqueId:{
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  avgResponseTime: {
    type: Number,
    default: 30,
  },
  status:{
    type: String,
    default: 'Pending'
  },
  availability: {
    type: String,
    enum: ["Available", "Unavailable"],
    default: "Available",
  },
  pricing: {
    minRate: {
        type: Number,
        min: [2000, 'The minimum rate on the platform is ₦2,000'],
    },
    dailyRate:{
        type: Number,
        required: true
    }
  },
  location:{
    state: String,
    lga: String,
    town: String
  },
  localities: [{
    type: String
  }],
  category: {
    name:{
      type: String,
      required: true
    },
    sn:{
      type: String,
      required: true
    }
  },
  myTasks: [
    {
      task: {
        type: mongoose.Schema.ObjectId,
        ref: "Task",
        required: true,
      },
    },
  ],
  numOfReviews: {
    type: Number,
    default: 0
  },
  ratings:{
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

workerSchema.pre('save', async function(){
    if(this.isNew){
        this.uniqueId = await this.constructor.generateNextUniqueId();
    }
})

workerSchema.statics.generateNextUniqueId = async function () {
  const lastWorker = await this.findOne().sort({ uniqueId: -1 });
  return lastWorker && !isNaN(lastWorker.uniqueId)? (parseInt(lastWorker.uniqueId) + 1).toString() : "100";
};

module.exports = mongoose.model("Worker", workerSchema);
