const got = require("got");
const Task = require("../models/task");
const Town = require("../models/address/town");
const User = require("../models/user");
const Artisan = require("../models/artisan");
const catchAsyncErrors = require("../midllewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");
const Worker = require("../models/worker");
const { debitWallet } = require("./paymentController");
const Review = require("../models/review");
const FuzzySearch = require("../utils/FuzzySearch");
const WhatAppTempId = require("../models/whatAppTempId");
const { sendWhatsAppMessage } = require("../utils/taskNotification");
const sendSMS = require("../utils/sendSMS");
const user = require("../models/user");

//Create new task => /api/v1/task/new
exports.newTask = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  req.body.workers = req.body.worker? [{worker: req.body.worker}]:[]

  const tasksBelongsToUser = user.workers?.find(profile => profile._id.toString() === req.body.worker);

  if(tasksBelongsToUser){
    return next(new ErrorHandler("You cannot apply to self!", 403))
  }

  const task = await Task.create({...req.body, user: user.id});


  if(task && task.workers.length > 0){
    //Send a WhatsApp notification to the worker, where he can accept or reject the request

    const moreTask = await Task.findById(task._id)
            .populate({
              path: "workers.worker",
              select: "pricing",
              populate: {
                path: "owner",
                select: "firstName lastName phoneNumber",
              },
            })
            .populate({
              path: "location.lga",
              select: "name",
              populate: {
                path: "state",
                select: "name",
              },
            })
            .populate("user", "firstName lastName phoneNumber", User);

    const header = `${moreTask.title} Job Request`.toUpperCase();
    const message = `Hello ${moreTask.workers[0].worker.owner.firstName},
        You have a ${moreTask.title} job request from ${moreTask.user.firstName} ${moreTask.user.lastName}. Please confirm your availability within 30 minutes to receive the task owner's contact info.\n
        Confirming availability incurs a N100 service fee.\n
        For more details, log in to your dashboard on our web platform.
        https://www.ebiwon.com`;
    const SMSmessage = `Hello ${moreTask.workers[0].worker.owner.firstName}, ${task.title} job request in ${moreTask.location.town}, ${moreTask.location.lga.name}. Please confirm your availability on the web platform. You have 30 mins to respond. Visit www.ebiwon.com`
    const location = `Task location: ${moreTask.location.town}, ${moreTask.location.lga.name}, ${moreTask.location.lga.state.name} State.`

    // create a whatsapp chat identifier
    const worker = await Worker.findById(req.body.worker).populate({path:'owner', select:'phoneNumber'});
    
    const waId = `234${worker.owner.phoneNumber.slice(-10)}`

    sendSMS(SMSmessage, `+${waId}`);
    sendWhatsAppMessage(waId, worker._id, {id:moreTask._id, header, message, location});
  }

  res.status(201).json({
    success: true,
    mesage: "Task created successfully",
  });
});

//Create a task request => /api/v1/task/request
exports.newTaskRequest = catchAsyncErrors(async(req, res, next)=>{
  req.body.user = req.user.id
  req.body.status = 'Request';
  
  const { state, lga, town:name } = req.body.location
  const filter = { state, lga, name }
  const options = {upsert: true, new: true}

  await Town.findOneAndUpdate(filter, filter, options);
  
  await Task.create(req.body);

  res.status(200).json({
    success: true,
    message: "Task created successfully"
  })
})


exports.requestApplication = catchAsyncErrors(async(req, res, next)=>{
  const task = await Task.findById(req.body.taskId)
                .populate("user", "firstName lastName phoneNumber", User);
  
  const workerProfile = req.user.workers.find(workerProfile => workerProfile._id.equals(req.body.profileId));

  if(task && workerProfile){

    const hasApplied = task.applicants.findIndex(applicant => applicant.worker.equals(workerProfile._id)) !== -1;

    const tasksBelongsToUser = task.user.equals(req.user._id);

    if(tasksBelongsToUser){
      return next(new ErrorHandler("You cannot apply to self!", 403))
    }

    if(hasApplied){
      return next(new ErrorHandler("This business profile has already applied", 409))
    }

    let { message } = req.body;
    
    message = message?.length > 7? message : "Sure, I'd be happy to take on the job!";

    task.applicants.push({worker: workerProfile._id, message});

    if(task.applicants.length === 1){
      const waId = `234${task.user.phoneNumber.slice(-10)}`
      const message = `Hello ${task.user.firstName}, your ${task.title} job request has started receiving applications. Check your dashboard on the web platform to review and select the perfect candidate for the job. Visit https://www.ebiwon.com for more details.`
      await sendSMS(message, `+${waId}`);
      // Consider sending to the whatsapp platform
    }


    await task.save();

    // TODO: Notify the task requester about this application

    res.status(200).json({
      success: true,
      message: 'Application received'
    });
  }else{
    next(new ErrorHandler('Not authorized action', 401))
  }
})

// Get logged in user task => /api/v1/user/tasks
exports.myTasks = catchAsyncErrors(async (req, res, next) => {
  const searchFields = ['status']
  const resPerPage = 10;
  const searchQuery = req.query.keyword==='undefined'?'':req.query;
  const apiFeatures = new APIFeatures(Task.find({ user: req.user.id })
    .populate("workers.review", "name comment rating", Review)
    .populate({
      path:"applicants.worker",
      select:"message createdAt",
      populate:{
        path: "owner", 
        select:"firstName lastName avatar"
      }
    })
    .populate({
      path:"workers.worker",
      select:"pricing",
      populate:{
        path: "owner", 
        select:"firstName lastName phoneNumber avatar"
      }
    }), searchQuery, searchFields)
    .search()
    // .filter()

  apiFeatures.pagination(resPerPage);
  let tasks = await apiFeatures.query;

  tasks = tasks.map(task => {
      if(!['Completed', 'Accepted'].includes(task.status)) 
          task.workers = task.workers.map(workerObj => {
            workerObj.worker.owner.phoneNumber = null
            return workerObj;
          })
      return task
    })

  res.status(200).json({
    success: true,
    tasks,
  });
});

// Get logged in worker task => /api/v1/user/works
exports.myWorks = catchAsyncErrors(async (req, res, next) => {
  const searchQuery = req.query.keyword==='undefined'?'':req.query;
  const searchFields = ['status']
  const resPerPage = 10;
  const apiFeatures = new APIFeatures(Task.find({ "workers.worker": { $in: req.user.workers } })
    .populate('workers.worker','pricing')
    .populate("user","firstName lastName avatar phoneNumber",User), searchQuery, searchFields)
    .search()

  apiFeatures.pagination(resPerPage);
  let works = await apiFeatures.query;


  if(works){
    works = works.map(task =>{
      if(!['Completed', 'Accepted'].includes(task.status)) 
        task.user.phoneNumber = null

      const workerIndex = task.workers.findIndex(workerObj => {
        return req.user.workers.some(worker => worker._id.equals(workerObj.worker._id))
      })
      
      const taskObj = task.toObject();
      const newTask = {...taskObj.workers[workerIndex], ...taskObj}
      delete newTask.workers
      return newTask;
    })
  }

  res.status(200).json({
    success: true,
    works,
  });
});

exports.updateTask = catchAsyncErrors(async (req, res, next) => {
  
  const task = await Task.findById(req.params.id)
  .populate({
      path: "workers.worker",
      select: "pricing",
      populate: {
        path: "owner",
        select: "firstName lastName phoneNumber",
      },
    })
    .populate({
      path: "location.lga",
      select: "name",
      populate: {
        path: "state",
        select: "name",
      },
    })
    .populate("user", "firstName lastName phoneNumber", User);

  let workerIndex = task.workers.findIndex(workersObj => workersObj._id.equals(req.body.workerId))
  
  const isUser = task.user.equals(req.user.id);
  
  // const loggedWorkerIndex = task.workers.findIndex(workerObj => workerObj.worker.equals(req.user.id));
  const loggedWorkerIndex = task.workers.findIndex(workerObj => {
    return req.user.workers.some(profile => profile._id.equals(workerObj.worker._id))
  });
  
  let allCompleted = task.workers.map(taskObj => 
      taskObj.escrow.user === 'Completed' && taskObj.escrow.worker === 'Completed')
    .every(status => status === true);
  
  // allCompleted = allCompleted.every(status => status === true);

  
  
  if (isUser) {
    if(task.status === "Request"){
      //Make sure the worker index is also the applicant index
      const applicantId = req.body.workerId;
      
      const worker = await Worker.findById(applicantId)
      const platformCommission = task.budget? 
          parseFloat(task.budget * 0.1) : 
          parseFloat(worker.pricing.minRate * 0.1)

      let applicantExist = task.workers.find(workerObj => workerObj.worker._id.toString() === applicantId)
      
      if(!applicantExist){
        task.workers = [...task.workers, {worker: applicantId}]

        // Delete the applicant's ID from the list of applicants
        task.applicants = task.applicants.filter(applicant => applicant.worker.toString() !== applicantId)
        
        const applicant = await Worker.findById(applicantId).populate({path:'owner', select:'firstName phoneNumber'});
        const waId = `234${applicant.owner.phoneNumber.slice(-10)}`
        
        const header = `${task.title} Job Approval Notice`.toUpperCase();
        const message = `Hi ${applicant.owner.firstName},
            Congrats on being approved for the ${task.title} job! Please confirm your availability within 30 minutes to receive the task owner's contact info.\n
            Confirming availability incurs a N${platformCommission} service fee.\n
            For more details, log in to your dashboard on our web platform.
            https://www.ebiwon.com`;
        const SMSmessage = `Hello ${moreTask.workers[0].worker.owner.firstName}, Congrats on being approved for the ${task.title} job!. Check your dashboard on the web platform to confirm availability. You have 30 mins to confirm. Visit www.ebiwon.com`
            
        const location = `Task location: ${task.location.town}, ${task.location.lga.name}, ${task.location.lga.state.name} State.`

        // Notify the applicant to accept the work
        // TODO: check if worker has opted to receive whatsApp notification
        sendSMS(SMSmessage, `+${waId}`)
        sendWhatsAppMessage(waId, applicantId, {id:task._id, header, message, location})
      }

    }else{
      // user cannot cancell a task that has been accepted
      if(req.body.status === "Cancelled" && task.workers[workerIndex].escrow.worker === "Accepted"){
        return next(new ErrorHandler("You cannot cancel this task"))
      }

      task.workers[workerIndex].escrow.user = req.body.status;
    }
  }else if(loggedWorkerIndex !== -1) {
    
    const debitWorker = task.workers[loggedWorkerIndex].escrow.worker === 'Pending' && req.body.status === 'Accepted'
        
    const platformCommission = task.budget? 
          parseFloat(task.budget * 0.1) : 
          parseFloat(task.workers[loggedWorkerIndex].worker.pricing.minRate * 0.1)

    task.workers[loggedWorkerIndex].escrow.worker = req.body.status;
  
    if(debitWorker){

      const debitStatus = await debitWallet(platformCommission, 'Work request comm', req.user._id);
      if(debitStatus === "insufficient"){
        return next(new ErrorHandler("Insufficient fund, top up and try again", 402))
      }

    }
  
  }else{
    return next(new ErrorHandler("Unauthorized Action", 400));
  }

  if(task.workers.length >= task.numberOfWorkers){
    
    if(task.status === "Request"){
      // Delete all applicants
      // task.applicants = []
    }

    task.status = allCompleted && task.status!=='Request'? 'Completed': req.body.status

  }

  await task.save();

  res.status(200).json({
    success: true,
  });
});

// return nearby tasks => '/api/v1/tasks/nearby'
exports.nearbyTasks = catchAsyncErrors(async(req, res, next)=>{
  
  const {categories, location} = req.body;

  const searchFields = ['location.town']
  
  const resPerPage = 10;

  const query = { status: 'Request' };

  if (location.state) { query['location.state'] = location.state; }

  if (location.lga) { query['location.lga'] = location.lga; }

  req.query.keyword = location.name
  req.query.page = '1'

  const tasks = await Task.find(query).populate("user","firstName lastName avatar",User)
  
  const fuzzySearch = new FuzzySearch(tasks, req.query, searchFields)
                        .search().pagination(resPerPage)

  let nearbyTasks = fuzzySearch.documents;

  res.status(200).json({
    success: true,
    nearbyTasks:tasks,
  });
})

exports.updateTaskProgress = catchAsyncErrors(async (req, res, next) => {
  const role = req.body.role;
  const task = await Task.findById(req.params.id);
  const user = req.body.role === "user"
                ? await User.findById(req.body.uid)
                : await Artisan.findById(req.body.uid);

  const isAuthorizedUser = role === "user"
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
