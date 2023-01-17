const express = require('express');
const router = express.Router();

const { 
    getArtisans, 
    newArtisan, 
    getArtisanDetails, 
    updateArtisan, 
    deleteArtisan, 
    createArtisanReview,
    getArtisanReviews,
    deleteReview,
    getAdminArtisans
} = require('../controllers/artisanController');

const { isAuthenticatedArtisan, authorizeRoles  } = require('../midllewares/auth');

router.route('/artisans').get(/*isAuthenticatedArtisan,*/ getArtisans); // more roles can be pass to the authorizeRole function like 'admin, editor, superAdmin...'
router.route('/artisan/:id').get(getArtisanDetails);

// router.route('/admin/artisan/new').post(isAuthenticatedUser, authorizeRoles('admin'), newArtisan); 
// router.route('/admin/artisan/:id')
//                     .put(isAuthenticatedUser, authorizeRoles('admin'), updateArtisan)
//                     .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteArtisan);

// router.route('/review').put(isAuthenticatedUser, createArtisanReview)
// router.route('/reviews')
//             .get(isAuthenticatedUser, getArtisanReviews)
//             .delete(isAuthenticatedUser, deleteReview)

// router.route('/admin/artisans').get(isAuthenticatedUser, authorizeRoles('admin'), getAdminArtisans)


            
module.exports = router;