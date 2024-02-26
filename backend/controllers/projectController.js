const Project = require('../models/project')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../midllewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary');
const User = require('../models/user');
const { debitWallet } = require('./paymentController');
const Ticket = require('../models/ticket');

// Create new project => /api/v1/punter/project/new
exports.newProject = catchAsyncErrors( async (req, res, next) => {

    const { startAt, endAt } = req.body;

    req.body.punter = req.user._id;

    // Check if the pproject start and end time reconcile
    const fiveHoursLater = new Date().getTime() + 5 * 60 * 60 * 1000
    const allowedProjectTimeFrame = new Date(startAt).getTime() > fiveHoursLater &&
                                    new Date(endAt) > new Date(startAt)
    
    if(!allowedProjectTimeFrame){
        return next(new ErrorHandler("Project must start at least six hours from now and must end later than start date", 403))   
    }
    const project = await Project.create(req.body);

    res.status(201).json({
        success: true,
        message: 'Project created successfully',
        project
    });
});

// Contribute/Subscribe to a project => /api/project/contribute
exports.contribute = catchAsyncErrors(async (req, res, next)=>{

    const { amount, projectId } = req.body
    let project, debitResponse

    
    try {

        project = await Project.findById(projectId)
    
        if(!project){
            return next(new ErrorHandler("Project Not Found"))
        }
        
        const contributorIndex = project.contributors.findIndex(contributor => contributor.userId.equals(req.user._id))
        const projectStarted = new Date() > new Date(project.startAt)

        if(projectStarted){
            return next(new ErrorHandler("Project unavailable for contribution"))
        }
    
        debitResponse = await debitWallet(amount, `Project contribution ref:${project.id}`, req.user._id)
        
        if(contributorIndex === -1){
            project.contributors.push({
                userId: req.user._id,
                amount
            })
        }else{
            project.contributors[contributorIndex].amount += parseInt(amount)
        }
        
        project.availableBalance += parseInt(amount)
    
        await project.save();

    } catch (error) {

        return next(new ErrorHandler(error.message, 500))

    } 

    res.status(200).json({
        success: true,
        project,
        walletBalance: debitResponse.walletBalance,
        message: 'Your contribution was successful'
    })
})

// Get all projects => /api/v1/projects?keyword=sports
exports.getProjects = catchAsyncErrors(async (req, res, next) => {

    const resPerPage = 10;
    const projectsCount = await Project.countDocuments();

    const apiFeatures = new APIFeatures(Project.find().populate('punter', 'username', User), req.query)
                        .search()
                        .filter()
    
    let projects = apiFeatures.query;
    let filteredProjectsCount = projects.length

    apiFeatures.pagination(resPerPage)
    projects = await apiFeatures.query;

    res.status(200).json({
        success: true,
        projectsCount,
        resPerPage,
        filteredProjectsCount,
        projects
    });
});

// Get all projects(Admin) => /api/v1/admin/projects
exports.getAdminProjects = catchAsyncErrors(async (req, res, next) => {

    const projects = await Project.find();

    res.status(200).json({
        success: true,
        projects
    });
});


// Get project by Id => /api/v1/project/:id
exports.getProjectPunter = catchAsyncErrors(async (req, res, next) => {

    const punter = await User.findById(req.params.id)
        .select(['-phoneNumber', '-bankAccounts', '-role', '-walletId', '-userMode', '-email', '-_id', '-__v']);
    
    if(!punter){
        return next(new ErrorHandler('User Not Found', 404));
    }
    const projectCount = await Project.countDocuments({
        $and:[
            {punter: req.params.id}, 
            {status:{$in:['successful', 'failed']}}
        ]
    })
    const successfulCount = await Project.countDocuments({punter: req.params.id, status: 'successful'})

    const pipeline = [
        {$match: {
            $and:[
                {punter: req.params.id}, 
                {status:{$in:['successful', 'failed']}}
            ]
        }},
        {$group: {_id: null, averageRoi: {$avg: '$roi'}}}
    ]
    const result = await Project.aggregate(pipeline)
    const averageRoi = result.length>0? result[0].averageRoi : 0


    const projects = await Project.find({punter: req.params.id});

    // Success Rate
    // Average ROI
    // Projects
    // Success
    

    res.status(200).json({
        success: true,
        projectCount,
        successfulCount,
        averageRoi,
        punter,
        projects,
    });
});

// Get project by Id => /api/v1/project/:id
exports.getSingleProject = catchAsyncErrors(async (req, res, next) => {

    const project = await Project.findById(req.params.id);

    if(!project){
        return next(new ErrorHandler('Project Not Found', 404));
    }

    const tickets = await Ticket.find({projectId: project._id})

    res.status(200).json({
        success: true,
        project,
        tickets
    });
});

// Upate project => /api/v1/admin/project/:id
exports.updateProject = catchAsyncErrors(async (req, res, next) => {
    
    let project = await Project.findById(req.params.id);

    if(!project){
        return next(new ErrorHandler('Project Not Found', 404));
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        project
    })
});

// Delete Project
exports.deleteProject = catchAsyncErrors(async (req, res, next) => {
    let project = await Project.findById(req.params.id);

    if(!project){
        return next(new ErrorHandler('Project Not Found', 404));
    }

    // Deleting images associated with the project
    for(let i = 0; i < project.images.length; i++){
        const result = await cloudinary.v2.uploader.destroy(project.images[i].public_id)
    }

    await project.remove();

    res.status(200).json({
        success: true,
        message: 'Project is deleted succesfully'
    });
});

// Create new review =>     /api/v1/review
exports.createProjectReview = catchAsyncErrors( async (req, res, next) => {
    const { rating, comment, projectId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const project = await Project.findById(projectId)

    const hasReviewed = project.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if(hasReviewed){
        project.reviews.forEach( review => {
            if(review.user.toString() === req.user._id.toString()){
                review.comment = comment,
                review.rating = rating
            }
        })

    } else {
        project.reviews.push(review);
        project.numOfReviews = project.reviews.length
    }

    project.ratings = project.reviews.reduce( (acc, item) => item.rating + acc, 0 ) / project.reviews.length

    await project.save( { validateBeforeSave: false } )

    res.status(200).json({
        success: true
    })
})

// Get Project Reviews   =>  /api/v1/reviews
exports.getProjectReviews = catchAsyncErrors( async (req, res, next) => {
    const project = await Project.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews: project.reviews
    })
})


// Delet Project Review   =>  /api/v1/reviews
exports.deleteReview = catchAsyncErrors( async (req, res, next) => {
    const project = await Project.findById(req.query.projectId);

    const reviews = project.reviews.filter(review => review._id.toString() !== req.query.id.toString());
    const ratings = project.reviews.reduce( (acc, item) => item.rating + acc, 0 ) / reviews.length

    const numOfReviews = reviews.length

    await Project.findByIdAndUpdate(req.query.projectId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})














