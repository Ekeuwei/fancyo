const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const artisanSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    maxlength: [20, "Your name cannot exceed 20 characters"],
  },
  lastName: {
    type: String,
    required: true,
    maxlength: [20, "Your name cannot exceed 20 characters"],
  },
  displayName: {
    type: String,
    maxlength: [20, "Your display name cannot exceed 20 characters"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please enter valide email address"],
  },
  phoneNumber: {
    type: Number,
    required: true,
    minlength: [10, "Phone number not complete"],
  },
  gender: {
    type: String,
    required: true,
  },
  contact: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    lga: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Your password must be at least 6 characters long"],
    select: false, //the password should not be displayed when displaying the artisan
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
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
  availability: {
    type: String,
    default: "Available",
  },
  pricing: {
    type: Number,
    default: 500,
  },
  serviceTags: [
    {
      service: {
        type: String,
      },
    },
  ],
  category: {
    type: String,
    default: "Worker",
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
  role: {
    type: String,
    default: "artisan",
  },
  kyc: {
    type: String,
    default: "Unverified",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

// Encrypting password before saving
artisanSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// Compare artisan password
artisanSchema.methods.compareArtisanPassword = async function (
  enteredPassword
) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Return JWT token
artisanSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

// Generate password reset token
artisanSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash and set to resetpasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set token expire time
  this.resetPasswordExpires = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("Artisan", artisanSchema);
