const express = require('express');
const router = express.Router();

const { createWorker, getWorkers, getWorkerDetails } = require('../controllers/workerController');
const { isAuthenticatedUser } = require('../midllewares/auth');

router.route('/workers').get(getWorkers);
router.route('/worker/:id').get(getWorkerDetails)

router.route('/create/worker').post(isAuthenticatedUser, createWorker)

module.exports = router