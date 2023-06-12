const express = require('express');
const router = express.Router();

const { 
    registerArtisan, 
    loginArtisan,
    logoutArtisan
} = require('../controllers/artisanController');

const { 
    registerUser, 
    loginUser, 
    logout, 
    forgotPassword, 
    resetPassword, 
    getUserProfile,
    updatePassword, 
    updateProfile,
    allUsers,
    getUserDetails,
    updateUser,
    deleteUser,
    changeMode
} = require ('../controllers/authController');

const { isAuthenticatedUser, authorizeRoles } = require('../midllewares/auth')

router.route('/artisan/register').post(registerArtisan);
router.route('/artisan/login').post(loginArtisan);

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/me').get(isAuthenticatedUser, getUserProfile);
router.route('/me/changemode').get(isAuthenticatedUser,changeMode)
router.route('/password/update').put(isAuthenticatedUser, updatePassword);
router.route('/me/update').put(isAuthenticatedUser, updateProfile);

router.route('/logout').get(logout);
router.route('/logout/artisan').get(logoutArtisan);

router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), allUsers);
router.route('/admin/user/:id')
            .get(isAuthenticatedUser, authorizeRoles('admin'), getUserDetails)
            .put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
            .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

module.exports = router;