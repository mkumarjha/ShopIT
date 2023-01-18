const express = require('express');
const router = express.Router();

const { 
    registerUser, 
    loginUser, 
    logoutUser, 
    forgotPassword, 
    resetPassword,
    getUserProfile,
    updatePassword,
    updateProfile,
    allUsers,
    getUserDetails,
    updateUser,
    deleteUser
} = require('../controllers/authController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.get('/logout', logoutUser);
router.get('/me', isAuthenticatedUser, getUserProfile);
router.put('/password/update', isAuthenticatedUser, updatePassword );
router.put('/me/update', isAuthenticatedUser, updateProfile );
router.get('/admin/users', isAuthenticatedUser, authorizeRoles('admin'), allUsers );
router.get('/admin/user/:id', isAuthenticatedUser, authorizeRoles('admin'), getUserDetails );
router.put('/admin/user/:id', isAuthenticatedUser, authorizeRoles('admin'), updateUser );
router.delete('/admin/user/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteUser );


module.exports = router;