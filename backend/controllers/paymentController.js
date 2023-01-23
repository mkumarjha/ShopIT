const catchAsyncError = require('../middlewares/catchAsyncErrors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// prcess stripe payement => /api/v1/payment/process
exports.processPayment = catchAsyncError(async (req, res) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'usd',
        metadata: { integration_check: 'accept_a_payment' }
    })

    res.status(200).json({
        success: true, 
        client_Secret: paymentIntent.clientSecret
    });
});


// send stripe api key => /api/v1/stripeapi
exports.sendStripeApi = catchAsyncError(async (req, res, next) => {
    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
    });
});