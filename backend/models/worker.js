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
        min: [1000, 'The minimum rate should be at least ₦1,000']
    },
    dailyRate:{
        type: Number,
        required: true
    }
  },
  localities: [{
    type: String
  }],
  category: {
    name:{
      type: String,
      required: true
    },
    key:{
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


module.exports = mongoose.model("Worker", workerSchema);
