const asyncHandler = require('express-async-handler');
const axios = require('axios');
const sendEmail = require('../utils/mailUtil')

// Helper function to get the temporary OAuth token from FedEx
const getFedExToken = async () => {
    // FedEx requires these credentials in the body as urlencoded data
    const data = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.FEDEX_API_KEY,
        client_secret: process.env.FEDEX_SECRET_KEY
    });

    // We use the sandbox URL for development
    const response = await axios.post('https://apis-sandbox.fedex.com/oauth/token', data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    return response.data.access_token;
};

// @desc    Track FedEx Package
// @route   POST /api/shipping/fedex/track
const trackFedEx = asyncHandler(async (req, res) => {
    const { trackingNumber } = req.body;

    if (!trackingNumber) {
        res.status(400);
        throw new Error('Please provide a tracking number');
    }

    try {
        // Step 1: Get the fresh token (valid for 1 hour)
        const token = await getFedExToken();

        // Step 2: Use the token to get tracking info
        const response = await axios.post(
            'https://apis-sandbox.fedex.com/track/v1/trackingnumbers',
            {
                trackingInfo: [{ trackingNumber }]
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('FedEx API Error:', error.response ? error.response.data : error.message);
        res.status(error.response?.status || 500);
        throw new Error(error.response?.data?.errors?.[0]?.message || 'FedEx API request failed');
    }
});

module.exports = { trackFedEx };