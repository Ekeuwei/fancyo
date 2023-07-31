const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../midllewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');

const crypto = require('crypto');
const cloudinary = require('cloudinary');
const Wallet = require('../models/wallet');
const Worker = require('../models/worker');
const Town = require('../models/address/town');
const { activationEmailTemplate, activationEmailTemplate2, passwordResetTemplate } = require('../utils/emailTemplates');
 
// Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors( async (req, res, next) =>{

    let activationToken = undefined;

    const { firstName, lastName, phoneNumber, gender, email, password, avatar } = req.body;
    
    const result = await cloudinary.v2.uploader.upload(avatar, {
        folder: 'avatars',
        width: 600,
        crop: 'scale'
    })

    let user;

    try {
        user = await User.create({
            firstName,
            lastName,
            phoneNumber,
            gender,
            email,
            password,
            // avatar
            avatar: {
                public_id: result.public_id,
                url: result.secure_url
            }
        });

        const wallet = await Wallet.create({
            userId: user._id
        })

        user.walletId = wallet._id;
        
        activationToken = user.getActivationToken();

        user = await user.save({ validateStateBeforeSave: false });

    } catch (error) {
        await cloudinary.v2.uploader.destroy(result.public_id); // Delete uploaded image
        next(new ErrorHandler(error.message, 500));
    }

    // Create activation url
    const activationUrl = `${process.env.FRONTEND_URL}/activate?token=${activationToken}`

    // const message = `Please click on the following link to activate your account:\n\n${activationUrl}\n\nPlease ignore this message if you did authorize the requested.`
    const message = activationEmailTemplate(activationUrl, user.firstName)

    try {

        await sendEmail({
            email: user.email,
            subject: `${process.env.APP_NAME} Account Activation`,
            message
        });

    } catch (error) {

        next(new ErrorHandler(error.message), 500)
    }

    // TODO: reqeust newly registered user to activate their account.
    res.status(200).json({
        success: true,
        message: `We have sent a confirmation email to your email address. Please follow the instructions in the confirmation email in order to activate your account.`
    })
    // sendToken(user, 200, res);

})

// Login user => /api/v1/login
exports.loginUser = catchAsyncErrors( async (req, res, next)=>{
    const { email, password } = req.body;

    // Check if email is entered by user
    if(!(email || password)){
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    // Finding user in database
    const user = await User.findOne({ email })
                .populate({path: 'contact.town', select: 'name lga state', populate:{path: 'lga state', select: 'name sn'}})
                .populate('workers', 'category', Worker)
                .select('+password +isActivated');

    if(!user){
        return next(new ErrorHandler('Invalid Email or Password', 401))
    }

    // Check if password is correct or not
    const isPasswordMatched = await user.compareUserPassword(password);
    
    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid Email or Password', 401))
    }
    
    if(!user.isActivated){

        res.status(401).json({
            isActivated: false,
            message: 'Please activate your account and try again'
        })

    }else{

        sendToken(user, 200, res);
    }

});

// Keep page alive => /api/v1/alive
exports.keepAlive = catchAsyncErrors(async (req, res, next)=>{
    res.status(200).json({
        success: true,
        message: "We're live :-)"
    })
})

// Reset password => /api/v1/activate
exports.resendActivationToken = catchAsyncErrors( async (req, res, next) => {

    const user = await User.findOne( { email: req.query.email });

    if(!user){
        return next(new ErrorHandler('User not found with this email', 404));
    }

    // Set up new password
    const activationToken = user.getActivationToken();
    await user.save({ validateStateBeforeSave: false });

    // Create activation url
    const activationUrl = `${process.env.FRONTEND_URL}/activate?token=${activationToken}`

    // const message = `Please click on the following link to activate your account:\n\n${activationUrl}\n\nPlease ignore this message if you did authorize the requested.`
    const message = activationEmailTemplate2(activationUrl, user.firstName)

    try {

        await sendEmail({
            email: user.email,
            subject: `${process.env.APP_NAME} Account Activation`,
            message
        });

        res.status(200).json({
            success: true,
            message: `Activation link sent`
        });

    } catch (error) {
        user.activationToken = undefined;
        await user.save({ validateStateBeforeSave: false });
        next(new ErrorHandler(error.message), 500)
    }

});

// Activate user account => /api/v1/activate/:token
exports.activateUser = catchAsyncErrors( async (req, res, next) => {

    const user = await User.findOne({ activationToken: req.params.token });

    if(!user){
        return next(new ErrorHandler('Invalid activation token', 400));
    }

    // Set up new password
    user.isActivated = true;
    user.activationToken = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        title: "Account activation successful",
        message: `Congratulations! Your account has been successfully verified and activated. You can now fully access and enjoy all the features and services provided by ${process.env.APP_NAME}.`
    })

});

// Forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if(!user){
        return next(new ErrorHandler('User not found with this email', 404))
    }

    // Get reset token 
    const resetToken = user.getResetPasswordToken();

    await user.save( { validateStateBeforeSave: false });

    // Create reset password url
    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}` 
    // const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}` // Development

    // const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nPlease ignore this message if you did authorize the requested.`
    const message = passwordResetTemplate(resetUrl, user.email, user.firstName)

    try {

        await sendEmail({
            email: user.email,
            subject: `${process.env.APP_NAME} Password Recovery`,
            message
        });

        res.status(200).json({
            success: true,
            message: `email sent to: ${user.email}`
        });

    } catch (error) {
        user.getResePasswordToken = undefined;
        user.resetPasswordExpres = undefined;

        await user.save( { validateStateBeforeSave: false } );

        next(new ErrorHandler(error.message), 500)
    }

});

// Reset password => /api/v1/password/:token
exports.resetPassword = catchAsyncErrors( async (req, res, next) => {

    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    

    const user = await User.findOne( { 
        resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() }
     });

     if(!user){
         return next(new ErrorHandler('Password reset token is invalide or has expired', 400));
     }

     if(req.body.password !== req.body.confirmPassword){
         return next(new ErrorHandler('Password does not match', 400));
     }

     // Set up new password
     user.password = req.body.password;
     user.resetPasswordToken = undefined;
     user.resetPasswordExpires = undefined;

     await user.save();

     sendToken(user, 200, res);

});

// Get currently logged in user details => /api/v1/me
exports.getUserProfile = catchAsyncErrors( async (req, res, next) => {
    const user = req.user;

    res.status(200).json({
        success: true,
        user
    });
});

exports.changeMode = catchAsyncErrors(async(req, res, next) => {
    
    const user = req.user;

    if(user.role !== 'worker'){
        return next(new ErrorHandler('Not Allowed', 403))
    }
    
    user.userMode = !user.userMode;

    await user.save()

    res.status(200).json({
        success: true,
        message: 'Mode changed',
        user,
    })
})

// Update / change password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // Check previous user password

    const isPasswordMatched = await user.compareUserPassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler('Old pasword is incorect', 400));
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res);
});

// Update user profile  => /api/v1/me/update
exports.updateProfile = catchAsyncErrors( async (req, res, next) => {
    const newUserData = JSON.parse(req.body.data)

    
    // Update avatar 
    if(newUserData.avatar){
        const user = await User.findById(req.user.id)
        
        const image_id = user.avatar.public_id
        
        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: 'scale'
        });
        
        await cloudinary.v2.uploader.destroy(image_id)
        
        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }
    }

    if(newUserData.contact){
        
        const filter = {
            name: newUserData.contact.town,
            lga: newUserData.contact.lga,
            state: newUserData.contact.state
        }
        const options = {upsert: true, new: true}

        const town = await Town.findOneAndUpdate(filter, newUserData.contact, options);
        
        newUserData.contact.town = town._id;
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    });
});

// Logout user => /app/v1/logout
exports.logout = catchAsyncErrors( async (req, res, next)=>{
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
});


// Admin Routes

// Get all users => /api/v1/users
exports.allUsers = catchAsyncErrors( async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    });
});

// Get user details => /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        user
    });

});

// Update user profile  => /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors( async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    });
});

// Delete user => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`, 404));
    }

    // Remove avatar from cloudinary server
    const image_id = user.avatar.public_id
    await cloudinary.v2.uploader.destroy(image_id)

    await user.remove();

    res.status(200).json({
        success: true,
        user
    });

});