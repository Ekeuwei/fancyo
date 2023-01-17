const Task = require("../models/task");
const User = require("../models/user");
const Artisan = require("../models/artisan");
const catchAsyncErrors = require("../midllewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");

//Create new task => /api/v1/task/new
exports.newTask = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id
  const task = await Task.create(req.body);

  res.status(201).json({
    success: true,
    mesage: "Task created succesfully",
  });
});

// Get logged in user task => /api/v1/task
exports.myTasks = catchAsyncErrors(async (req, res, next) => {
  const tasks = await Task.find({ user: req.user.id }).populate(
    "worker",
    "firstName lastName avatar",
    User
  );

  res.status(200).json({
    success: true,
    tasks,
  });
});

// Get logged in worker task => /api/v1/works
exports.myWorks = catchAsyncErrors(async (req, res, next) => {
  const tasks = await Task.find({ worker: req.user.id }).populate(
    "user",
    "firstName lastName avatar",
    User
  );

  res.status(200).json({
    success: true,
    tasks,
  });
});

exports.updateTask = catchAsyncErrors(async (req, res, next) => {
  const role = req.body.role;
  const user = req.user;
  const task = await Task.findById(req.params.id);
    // req.body.role === "user"
    //   ? await User.find({user:req.body.uid})
    //   : await User.find({worker:req.body.uid});
  const authorizedUser = task[role].equals(user.id);
  console.log(role, task[role], user.id);
  // const isAuthorizedUser =
  //   role === "user" ? task.user === user._id : task.artisan === user._id;

  if (authorizedUser) {
    task.escrow[role] = req.body.status;
  }else {
    return next(new ErrorHandler("Unauthorized Action", 400));
  }

  /*
  if (req.body.status === "Cancel") {
    if (role === "user" && task.escrow[role] !== "In Progress") {
      return next(
        new ErrorHandler(
          "The job has started already! Ask the worker to cancel it",
          400
        )
      );
    }

    if (task.user == user) {
      task.escrow[role] = "Canceled";
    }
  }

  // Only the requested artisan can accept a task
  if (req.body.status === "Accept") {
    if (task.artisan == artisan) {
      task.escrow[role] = "In Progress";
    }
  }

  if (req.body.status === "Completed") {
    if (task.artisan == artisan) {
      task.escrow.artisan = "Confirmed";
    }

    if (task.user == user) {
      task.escrow.user = "Confirmed";
    }
  }
  */

  await task.save();

  res.status(200).json({
    success: true,
  });
});

exports.updateTaskProgress = catchAsyncErrors(async (req, res, next) => {
  const role = req.body.role;
  const task = await Task.findById(req.params.id);
  const user =
    req.body.role === "user"
      ? await User.findById(req.body.uid)
      : await Artisan.findById(req.body.uid);

  const isAuthorizedUser =
    role === "user"
      ? task.user.equals(user._id)
      : task.artisan.equals(user._id);

  if (isAuthorizedUser) {
    task.escrow[role] = req.body.status;
  } else {
    return next(new ErrorHandler("Unauthorized Action", 400));
  }

  await task.save();

  res.status(200).json({
    success: true,
  });
});
