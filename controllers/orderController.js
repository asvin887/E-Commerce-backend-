// controllers/orderController.js

const Order = require('../models/orderModel');
const asyncHandler = require('express-async-handler');
const sendEmail = require('../utils/mailUtil');

// Create new order
const addOrderItems = asyncHandler(async (req, res) => {
    const { 
    	orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
		} = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
        return;
    } else {
        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        //Email confirmation for the order.
        const emailSubject = `Order Confirmation - #${createdOrder._id}`;
        const emailBody = `<h1> Thank You for your Order, ${req.user.name}!</h1>
                           <p> Your order for ${createdOrder.orderItems.length} items is being processed. </p>`;
        
        // Use the correct filename: mailUtil
        await sendEmail(req.user.email, emailSubject, emailBody);

        res.status(201).json(createdOrder);
    }
});

// Get order by ID
const getOrderById = asyncHandler(
    async (req, res) => {
        const order = await Order.findById(
            req.params.id
        ).populate("user", "name email");

        if (order) {
            res.json(order);
        } else {
            res.status(404);
            throw new Error("Order not found");
        }
    }
);

module.exports = { 
    addOrderItems, 
    getOrderById 
};