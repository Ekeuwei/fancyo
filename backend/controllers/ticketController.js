const Ticket = require('../models/ticket')
const Project = require('../models/project')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../midllewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary')
const got = require('got');
const { sporty } = require('../utils/bookies');

// Create new ticket => /api/v1/ticket/new
exports.newTicket = catchAsyncErrors( async (req, res, next) => {
    
    let games;

    const project = await Project.findById(req.body.projectId)

    if(!project){
        return next(new ErrorHandler("Invalid project ID", 403))
    }

    const authorizedPunter = project.punter.equals(req.user._id)

    if(!authorizedPunter){
        return next(new ErrorHandler("Unauthorized action", 403))
    }

    if(project.status !== 'in progress'){
        return next(new ErrorHandler("Project cannot receive tickets", 403))
    }

    if(project.availableBalance < parseInt(req.body.stakeAmount)){
        return next(new ErrorHandler("Bankroll too lower! Try lower stake amount", 403))
    }
    
    try {
        switch (req.body.bookie) {
            case "Sporty":
                games = await sporty(req.body.ticketId);
                break;
        
            default:
                return next(new ErrorHandler("Invalid Option Selected", 403))
            }
    } catch (error) {
        return next(new ErrorHandler(error.message, 403))
    }

    const threeHoursLater = new Date().getTime() + 3 * 60 * 60 * 1000
    const allGamesStartThreeHoursLater = games.every(game => game.time > threeHoursLater)
    if(!allGamesStartThreeHoursLater){
        // return next(new ErrorHandler("Tickets must be submitted 3 hours before kickoff of all matches.", 403))   
    }

    project.availableBalance -= parseFloat(req.body.stakeAmount)
    await project.save()

    req.body.games = games
    const ticket = await Ticket.create(req.body);

    res.status(201).json({
        success: true,
        message: 'New ticket added succesfully',
        ticket
    });
});


// Get ticket details from bookmaker => /api/v1/bookie/ticket
exports.loadBookieTicket = catchAsyncErrors(async (req, res, next) =>{
    let games;
    try {
        
        switch (req.query.bookie) {
            case "Sporty":
                games = await sporty(req.query.id);
                break;
        
            default:
                return next(new ErrorHandler("Invalid Option Selected", 403))
        }
    } catch (error) {
        
        return next(new ErrorHandler(error.message, 403))   
    }

    

    res.status(200).json({
        success: true,
        games
    })
})


// Upate ticket => /api/v1/admin/ticket/:id
exports.updateTicket = catchAsyncErrors(async (req, res, next) => {
    
    let ticket = await Ticket.findById(req.params.id);

    if(!ticket){
        return next(new ErrorHandler('Ticket Not Found', 404));
    }

    ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        ticket
    })
});

// Delete Ticket
exports.deleteTicket = catchAsyncErrors(async (req, res, next) => {
    let ticket = await Ticket.findById(req.params.id);

    if(!ticket){
        return next(new ErrorHandler('Ticket Not Found', 404));
    }

    await ticket.remove();

    res.status(200).json({
        success: true,
        message: 'Ticket is deleted succesfully'
    });
});

