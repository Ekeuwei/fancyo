// Check if user is authenticated or not

const jwt  = require("jsonwebtoken");
const user = require("../models/user");
const artisan = require("../models/artisan");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const Worker = require("../models/worker");

exports.isAuthenticatedUser = catchAsyncErrors( async (req, res, next)=>{

    const { token } = req.cookies;

    if(!token){
        return next(new ErrorHandler('Login first to access the resource', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await user.findById(decoded.id)
                .populate({path: 'contact.town', select: 'name lga state', populate:{path: 'lga state', select: 'name'}})
                .populate('workers', 'category', Worker);
    

    next();

});

// Handling user roles
exports.authorizeRoles = (...roles) => { // Spread the routes ...
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return next(
                    new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resources`, 403)
                )
        }

        next();
    }
}