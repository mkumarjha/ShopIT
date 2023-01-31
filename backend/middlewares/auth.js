const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require("./catchAsyncErrors");

// checks if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors( async (req, res, next) => {
    //const { token } = req.cookies;
    const token = req.header('authorization');
    
    if(!token){
        return next(new ErrorHandler('Login first to access this resource.',401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    next();
})

// Handling users roles
exports.authorizeRoles = (...roles)=> async (req, res, next) => {
    
    const token = req.header('authorization');
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    
    if(!roles.includes(req.user.role)){
        return next(new ErrorHandler(`Role (${req.user.role}) is not allowed to be accesse this resource`,403))
    }
    next();    
}