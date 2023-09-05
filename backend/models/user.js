const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Wallet = require('./wallet');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxlength: [20, 'Your name cannot exceed 20 characters']
    },
    lastName: {
        type: String,
        // required: true,
        maxlength: [20, 'Your name cannot exceed 20 characters']
    },
    email: {
        type: String,
        // required: true,
        unique: true,
        default: null,
        // validate: [validator.isEmail||validator.isEmpty, 'Please enter valid email address'],
        validate: {
            validator: function (value) {
                if (this.allowBankEmail && !value) {
                    return true;
                } else {
                    return validator.isEmail(value);
                }
            },
            message: 'Please enter valid email address'
        }
    },
    allowBankEmail:{
        type: Boolean,
        default: false
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: [10, 'Phone number not complete']
    },
    gender: {
        type: String,
        // required: true
    },
    contact: {
        address: String,
        town: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Town'
        },
    },
    password: {
        type: String,
        // required: true,
        // minlength: [6, 'Your password must be at least 6 characters long'],
        select: false //the password should not be displayed when displaying the user
    },
    isActivated: {
        type: Boolean,
        select: false,
        default: false
    },
    avatar: {
        public_id:{
            type: String,
            // required: true
        },
        url:{
            type: String,
            // required: true
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    userMode: {
        type: Boolean,
        default: true
    },
    workers: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Business'
        }
    ],
    walletId:{
        type: mongoose.Schema.Types.ObjectId
    },
    referralId:{
        type: String
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    activationToken:{
        type: String,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

// Encrypting password before saving
userSchema.pre('save', async function (next){
    
    if(!this.isModified('password')){
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);

});

// Compare user password
userSchema.methods.compareUserPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

// Return JWT token
userSchema.methods.getJwtToken = function(){
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { 
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}

// Generate activation token
userSchema.methods.getActivationToken = function(){
    // Generate token
    const activationToken = crypto.randomBytes(20).toString('hex');

    // set to activationToken
    this.activationToken = activationToken;

    return activationToken;
}

// Generate password reset token
userSchema.methods.getResetPasswordToken = function(){
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash and set to resetpasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token expire time
    this.resetPasswordExpires = Date.now() + 30 * 60 * 1000;

    return resetToken;
}


module.exports = mongoose.model('User', userSchema);