const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require('express-async-handler');

// @desc    Create Stripe Payment Intent
// @route   POST /api/payment/process
const processPayment = asyncHandler(async (req, res) => {
    const { amount } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // Amount in cents (e.g., $10.00 is 1000)
        currency: 'usd',
        metadata: { integration_check: 'accept_a_payment' },
    });

    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret,
    });
});

module.exports = { processPayment };