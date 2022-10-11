const express = require('express');
const router = express.Router();

const { 
    getProducts, 
    newProduct, 
    getSingleProduct, 
    updateProduct, 
    deleteProduct, 
    createProductReview,
    getProductReviews,
    deleteReview,
    getAdminProducts
} = require('../controllers/productController');

const { isAuthenticatedUser, authorizeRoles  } = require('../midllewares/auth');

router.route('/products').get(/*isAuthenticatedUser,*/ getProducts); // more roles can be pass to the authorizeRole function like 'admin, editor, superAdmin...'
router.route('/product/:id').get(getSingleProduct);

router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('admin'), newProduct); 
router.route('/admin/product/:id')
                    .put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
                    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

router.route('/review').put(isAuthenticatedUser, createProductReview)
router.route('/reviews')
            .get(isAuthenticatedUser, getProductReviews)
            .delete(isAuthenticatedUser, deleteReview)

router.route('/admin/products').get(isAuthenticatedUser, authorizeRoles('admin'), getAdminProducts)


            
module.exports = router;