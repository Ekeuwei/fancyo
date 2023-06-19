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

//Create new task => /api/v1/task/new
exports.newTask = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id
  req.body.workers = req.body.worker? [{worker: req.body.worker}]:[]

  const task = await Task.create(req.body);


  if(task && task.workers.length > 0){
    //Send a WhatsApp notification to the worker, where he can accept or reject the request

    // create a whatsapp chat identifier
    const worker = await Worker.findById(req.body.worker).populate({path:'owner', select:'phoneNumber'});
    
    const waId = `234${worker.owner.phoneNumber.slice(-10)}`

    const whatsAppTempId = await WhatAppTempId.create({
      taskId:task._id, workerId:req.body.worker, waId
    })
    
    const message = {
      "messaging_product": "whatsapp",
      "recipient_type": "individual",
      "to": `${whatsAppTempId.waId}`,
      "type": "interactive",
      "interactive": {
          "type": "button",
          "header": {
              "type": "text",
              "text": "TASK ALERT!!!"
          },
          "body": {
              "text": `${task.summary}. \n\nNOTE: to accept this task, your account will be debited ₦100 service fee.\n`
          },
          "footer": {
              "text": `Location: ${task.location.town}`
          },
          "action": {
              "buttons": [
                  {
                      "type": "reply",
                      "reply": {
                          "id": `${whatsAppTempId._id}+1`,
                          "title": "Yes"
                      }
                  },
                  {
                      "type": "reply",
                      "reply": {
                          "id": `${whatsAppTempId._id}+2`,
                          "title": "No"
                      }
                  }
              ]
          }
      }
    }

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`
      },
      json: message,
      responseType: 'json'
    };

    try {
      const phoneNumberId = '114237478363942';
      await got.post(`https://graph.facebook.com/v12.0/${phoneNumberId}/messages`, options)
      
    } catch (error) {
      console.error(error.message)
    }

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

// Get logged in user task => /api/v1/user/tasks
exports.myTasks = catchAsyncErrors(async (req, res, next) => {
  const searchFields = ['status']
  const resPerPage = 10;
  const searchQuery = req.query.keyword==='undefined'?'':req.query;
  const apiFeatures = new APIFeatures(Task.find({ user: req.user.id })
    .populate("workers.review", "name comment rating", Review)
    .populate({
      path:"workers.worker",
      select:"pricing",
      populate:{
        path: "owner", 
        select:"firstName lastName avatar"
      }
    }), searchQuery, searchFields)
    .search()
    // .filter()

  apiFeatures.pagination(resPerPage);
  let tasks = await apiFeatures.query;

  res.status(200).json({
    success: true,
    tasks,
  });
});

exports.requestApplication = catchAsyncErrors(async(req, res, next)=>{
  const task = await Task.findById(req.body.taskId);
  
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

    task.applicants.push({worker: workerProfile._id, message: req.body.message});


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

// Get logged in worker task => /api/v1/user/works
exports.myWorks = catchAsyncErrors(async (req, res, next) => {
  const searchQuery = req.query.keyword==='undefined'?'':req.query;
  const searchFields = ['status']
  const resPerPage = 10;
  const apiFeatures = new APIFeatures(Task.find({ "workers.worker": { $in: req.user.workers } })
    .populate('workers.worker','pricing')
    .populate("user","firstName lastName avatar",User), searchQuery, searchFields)
    .search()

  apiFeatures.pagination(resPerPage);
  let works = await apiFeatures.query;


  if(works){
    works = works.map(task =>{
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
    path: 'workers.worker',
    select: 'pricing',
    populate: {
      path: 'owner',
      select: 'firstName, lastName'
    }
  })

  let workerIndex = task.workers.findIndex(workersObj => workersObj._id.equals(req.body.workerId))
  
  const isUser = task.user.equals(req.user.id);
  
  // const loggedWorkerIndex = task.workers.findIndex(workerObj => workerObj.worker.equals(req.user.id));
  const loggedWorkerIndex = task.workers.findIndex(workerObj => {
    return req.user.workers.some(profile => profile._id.equals(workerObj.worker._id))
  });
  
  let allCompleted = task.workers.map(taskObj => taskObj.escrow.user === 'Completed' && taskObj.escrow.worker === 'Completed');
  
  allCompleted = allCompleted.every(status => status === true);
  
  if (isUser) {
    task.workers[workerIndex].escrow.user = req.body.status;
  }else if(loggedWorkerIndex !== -1) {
    
    const debitWorker = task.workers[loggedWorkerIndex].escrow.worker === 'Pending' && req.body.status === 'Accepted'
        
    const platformCommission = task.budget? 
          parseFloat(task.budget * 0.1) : 
          parseFloat(task.workers[loggedWorkerIndex].worker.pricing.minRate * 0.1)

    task.workers[loggedWorkerIndex].escrow.worker = req.body.status;
  
    if(debitWorker){

      await debitWallet(platformCommission, 'Work request comm', req.user._id);

    }
  
  }else{
    return next(new ErrorHandler("Unauthorized Action", 400));
  }

  task.status = allCompleted? 'Completed': req.body.status

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
