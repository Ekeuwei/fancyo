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
  bio: {
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
    default: "Available",
  },
  pricing: {
    amount: {
        type: Number,
        default: 500
    },
    billingCycle:{
        type: String,
        default: "Hourly"
    }
  },
  serviceTags: [],
  category: {
    type: String,
    required: true
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
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});


module.exports = mongoose.model("Worker", workerSchema);
