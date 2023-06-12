const express = require('express');
const router = express.Router();

const {
    walletBalance,
    processPayment, 
    sendStripeApiKey, 
    flwPaymentCallback, 
    flwPaymentWebhook, 
    flwPayment,
    walletTransactions
} = require('../controllers/paymentController')

const { isAuthenticatedUser } = require('../midllewares/auth');

router.route('/payment/process').post(isAuthenticatedUser, processPayment)
router.route('/stripeapi').get(isAuthenticatedUser, sendStripeApiKey)

router.route('/wallet').get(isAuthenticatedUser, walletBalance);
router.route('/wallet/transactions').get(isAuthenticatedUser, walletTransactions);
router.route('/flwpayment/process').post(isAuthenticatedUser, flwPayment);
router.route('/flwpayment/callback').get(isAuthenticatedUser, flwPaymentCallback);
router.route('/flwpayment/webhook').get(flwPaymentWebhook);


module.exports = router;