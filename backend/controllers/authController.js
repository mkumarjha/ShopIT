const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const cloudinary = require('cloudinary');

const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');


const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// register a user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const result = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder: 'avatars',
        width: 150,
        crop: 'scale'
    });   
    const { name, email, password } = req.body;
    const user = await User.create({ 
        name,
        email,
        password,
        avatar:{
            public_id:result.public_id,
            url:result.secure_url
        }
     });

    sendToken(user, 200, res);
    
})

//login a user => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {

    const { email, password } = req.body;

    if(!email || !password) {
        return next(new ErrorHandler('Please provide email and password', 400));
    }
    const user = await User.findOne({ email }).select('+password');

    if(!user) {   
        return next(new ErrorHandler('Invalid email or password', 401));
    }           
    
    // check if password is correct or not

    const isPasswordMatch = await user.comparePassword(password);
    if(!isPasswordMatch) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    sendToken(user, 200, res);
});

// Forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next)=>{

    const user = await User.findOne({ email: req.body.email });
    if(!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset password url
    const reseturl = `${req.protocol}://${req.hostname}/api/v1/password/reset/${resetToken}`;

    const message = ` Your password reset token is as follow :\n\n${reseturl}\n\n If you have not requested then please ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: `ShopIT password recovery`,
            message
        })

        res.status(200).json({
            success: true,
            message: `Email send to: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message,500));
    }

})

// Reset Password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if(!user) {
        return next(new ErrorHandler('Password reset token is invalid or has expired', 404));
    }

    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password doesnot match', 404));
    }

    // setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res)
})

// Get Currently logged in user details => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        status:'success',
        user
    })
})

// Update / Change Password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id).select('+password');

    // check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if(!isMatched) {
        return next(new ErrorHandler('Old password is incorrect', 400));        
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res);

});
// update user profile =>  /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    // update avtar: TODO

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true        
    });

});


// update user profile =>  /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email, 
        role: req.body.role
    }

    // update avtar: TODO

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true        
    });

});


// Logout user => /api/v1/logout
exports.logoutUser = catchAsyncErrors( async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    }); 

    res.status(200).json({
        status:'success',
        message: 'Logout successful'
    })
})

// Admin Routes

// Get all users => /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        status:'success',
        users
    });
});

// Get user details => /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user) {
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`, 404));
    }
    res.status(200).json({
        status:'success',
        user
    });
});

// Delete user => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`, 404));
    }

    // remove avtar: TODO
    
    await user.remove();

    res.status(200).json({
        status:'success',
        user
    });
});
