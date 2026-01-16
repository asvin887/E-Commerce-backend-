const express = require('express');
const router = express.Router();
const { trackFedEx } = require('../controllers/shippingController');
const { protect } = require('../middleware/authMiddleware');

// Define the tracking route
// 'protect' ensures only logged-in users with a valid token can track
router.post('/fedex/track', protect, trackFedEx);

module.exports = router;