const Worker = require("../models/worker");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../midllewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");
const sendEmail = require("../utils/sendEmail");

const cloudinary = require("cloudinary");
const User = require("../models/user");

exports.createWorker = catchAsyncErrors(async (req, res, next) => {
    
  const user = await User.findById(req.user.id);

  if(user.workers.length <= 1 || user.role === 'admin'){


    // const featuredGraphicsUpload = await cloudinary.v2.uploader.upload(req.body.featuredGraphics, {
    //     folder: 'avatars',
    //     width: 1024, // Adjust this value to match ui
    //     crop: 'scale'
    // })


    let {bio, serviceTags, category, billingFormat, billingAmount} = req.body;
  
    //   workerObj.featuredGraphics = {public_id: avatarUpload.public_id, url: avatarUpload.secure_url}

    let worker;

    try {
      worker = await Worker.create({
        owner: user.id,
        bio,
        serviceTags,
        category,
        pricing: {
          billingCycle: billingFormat, 
          amount: billingAmount
        }
      })
    } catch (error) {
      // await cloudinary.v2.uploader.destroy(featuredGraphicsUpload.public_id); // Delete uploaded image
      return next(error)
    }
    
    user.workers.push(worker._id)
    user.role = 'worker'

    await user.save()

    res.status(200).json({
          success: true
      });
  } else{
    return next(new ErrorHandler("You cannot create more workers", 405))
  }
});

// Get all workers => /api/v1/workers?keyword=apple
exports.getWorkers = catchAsyncErrors(async (req, res, next) => {

  const resPerPage = 3;
  const workersCount = await Worker.countDocuments();
  const searchFields = ['category', 'bio', 'displayName', 'serviceTags']
  const apiFeatures = new APIFeatures(Worker.find().populate('owner', 'firstName lastName avatar contact', User), req.query, searchFields).search();
  // .filter()

  apiFeatures.pagination(resPerPage);
  let workers = await apiFeatures.query;
  let filteredWorkersCount = workers.length;

  res.status(200).json({
    success: true,
    workersCount,
    resPerPage,
    filteredWorkersCount,
    workers,
  });
});

exports.getWorkerDetails = catchAsyncErrors (async (req, res, next)=>{

  const worker = await Worker.findById(req.params.id)
                      .populate('owner', 'avatar firstName lastName phoneNumber contact', User);

  if(!worker){
    next(new ErrorHandler(`Worker not found with ID:${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    worker
  })
})