const axios = require('axios');

const getFedExToken = async () => {
    const data = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.FEDEX_API_KEY,
        client_secret: process.env.FEDEX_SECRET_KEY
    });

    const response = await axios.post('https://apis-sandbox.fedex.com/oauth/token', data);
    return response.data.access_token;
};

const trackFedExPackage = async (trackingNumber) => {
    const token = await getFedExToken();
    const response = await axios.post('https://apis-sandbox.fedex.com/track/v1/trackingnumbers', {
        trackingInfo: [{ trackingNumber }]
    }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

module.exports = { trackFedExPackage };