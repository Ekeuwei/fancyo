const Artisan = require("../models/artisan");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../midllewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");
const sendArtisanToken = require("../utils/jwtArtisanToken");
const sendEmail = require("../utils/sendEmail");

const crypto = require("crypto");
const cloudinary = require("cloudinary");

// Register a artisan => /api/v1/register

exports.registerArtisan = catchAsyncErrors(async (req, res, next) => {
  const avatarUpload = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  // const featuredGraphicsUpload = await cloudinary.v2.uploader.upload(req.body.featuredGraphics, {
  //     folder: 'avatars',
  //     width: 1024, // Adjust this value to match ui
  //     crop: 'scale'
  // })

  let { firstName, lastName, phoneNumber, gender, contact, email, password } =
    req.body;

  contact = JSON.parse(contact);

  const artisan = await Artisan.create({
    firstName,
    lastName,
    phoneNumber,
    gender,
    contact,
    email,
    password,
    avatar: {
      public_id: avatarUpload.public_id,
      url: avatarUpload.secure_url,
    },
    name: `${firstName} ${lastName} ${contact.address} ${contact.city} ${contact.state} ${contact.lga}`,
  }).catch(async (err) => {
    await cloudinary.v2.uploader.destroy(avatarUpload.public_id); // Delete uploaded image
    catchAsyncErrors(next(err));
  });

  sendArtisanToken(artisan, 200, res);
});

// Login artisan => /api/v1/login
exports.loginArtisan = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email is entered by artisan
  if (!(email || password)) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  // Finding artisan in database
  const artisan = await Artisan.findOne({ email }).select("+password");

  if (!artisan) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  // Check if password is correct or not
  const isPasswordMatched = await artisan.compareArtisanPassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendArtisanToken(artisan, 200, res);
});

// Forgot Password => /api/v1/artisan/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const artisan = await Artisan.findOne({ email: req.body.email });

  if (!artisan) {
    return next(new ErrorHandler("Artisan not found with this email", 404));
  }

  // Get reset token
  const resetToken = artisan.getResetPasswordToken();

  await artisan.save({ validateStateBeforeSave: false });

  // Create reset password url
  // const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}` // Development
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nPlease ignore this message if you did authorize the requested.`;

  try {
    await sendEmail({
      email: artisan.email,
      subject: "ShopIt Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `email sent to: ${artisan.email}`,
    });
  } catch (error) {
    artisan.getResePasswordToken = undefined;
    artisan.resetPasswordExpres = undefined;

    await artisan.save({ validateStateBeforeSave: false });

    next(new ErrorHandler(error.message), 500);
  }
});

// Reset password => /api/v1/password/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash URL token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const artisan = await Artisan.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!artisan) {
    return next(
      new ErrorHandler("Password reset token is invalide or has expired", 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  // Set up new password
  artisan.password = req.body.password;
  artisan.resetPasswordToken = undefined;
  artisan.resetPasswordExpires = undefined;

  await artisan.save();

  sendArtisanToken(artisan, 200, res);
});

// Get currently logged in artisan details => /api/v1/me
exports.getArtisanProfile = catchAsyncErrors(async (req, res, next) => {
  const artisan = await Artisan.findById(req.artisan.id);

  res.status(200).json({
    success: true,
    artisan,
  });
});

// Update / change password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const artisan = await Artisan.findById(req.artisan.id).select("+password");

  // Check previous artisan password

  const isPasswordMatched = await artisan.compareArtisanPassword(
    req.body.oldPassword
  );

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old pasword is incorect", 400));
  }

  artisan.password = req.body.password;
  await artisan.save();

  sendArtisanToken(artisan, 200, res);
});

// Update artisan profile  => /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newArtisanData = {
    name: req.body.name,
    email: req.body.email,
  };

  // Update avatar

  if (req.body.avatar !== "") {
    const artisan = await Artisan.findById(req.artisan.id);

    const image_id = artisan.avatar.public_id;
    const res = await cloudinary.v2.uploader.destroy(image_id);

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newArtisanData.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const artisan = await Artisan.findByIdAndUpdate(
    req.artisan.id,
    newArtisanData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

// Logout artisan => /app/v1/logout/artisan
exports.logoutArtisan = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

// Admin Routes

// Get all artisans => /api/v1/artisans?keyword=apple
exports.getArtisans = catchAsyncErrors(async (req, res, next) => {
  // return next(new ErrorHandler('My Error', 400)) // Burble error

  const resPerPage = 3;
  const artisansCount = await Artisan.countDocuments();
  const fields = ['firstName', 'lastName', 'category']

  const apiFeatures = new APIFeatures(Artisan.find(), req.query, fields).search();
  // .filter()

  let artisans = apiFeatures.query;
  apiFeatures.pagination(resPerPage);
  artisans = await apiFeatures.query;
  let filteredArtisansCount = artisans.length;

  res.status(200).json({
    success: true,
    artisansCount,
    resPerPage,
    filteredArtisansCount,
    artisans,
  });
});

// Get artisan details => /api/v1/admin/artisan/:id
exports.getArtisanDetails = catchAsyncErrors(async (req, res, next) => {
  const artisan = await Artisan.findById(req.params.id);

  if (!artisan) {
    return next(
      new ErrorHandler(`Artisan does not found with id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    artisan,
  });
});

// Update artisan profile  => /api/v1/admin/artisan/:id
exports.updateArtisan = catchAsyncErrors(async (req, res, next) => {
  const newArtisanData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const artisan = await Artisan.findByIdAndUpdate(
    req.params.id,
    newArtisanData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

// Delete artisan => /api/v1/admin/artisan/:id
exports.deleteArtisan = catchAsyncErrors(async (req, res, next) => {
  const artisan = await Artisan.findById(req.params.id);

  if (!artisan) {
    return next(
      new ErrorHandler(`Artisan does not found with id: ${req.params.id}`, 404)
    );
  }

  // Remove avatar from cloudinary server
  const image_id = artisan.avatar.public_id;
  await cloudinary.v2.uploader.destroy(image_id);

  await artisan.remove();

  res.status(200).json({
    success: true,
    artisan,
  });
});
