const express = require('express');
const router = express.Router();

const { whatsApp } = require('../controllers/whatsAppWebhook');

router.route('/webhooks/whatsapp').post(whatsApp);

module.exports = router