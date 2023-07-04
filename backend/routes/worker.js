const express = require('express');
const router = express.Router();

const { createWorker, getWorkers, getWorkerDetails, getLoggedInUserWorkers, createWorkertReview, workerReviews } = require('../controllers/workerController');
const { isAuthenticatedUser } = require('../midllewares/auth');

router.route('/workers').get(getWorkers);
router.route('/user/workers').get(isAuthenticatedUser, getLoggedInUserWorkers);
router.route('/worker/:id').get(getWorkerDetails);

router.route('/create/worker').post(isAuthenticatedUser, createWorker)
router.route('/create/worker/review').put(isAuthenticatedUser, createWorkertReview)
router.route('/worker/reviews/:id').get(workerReviews)

module.exports = router