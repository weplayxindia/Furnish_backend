const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/order');
const User = require('../models/user');
const { RAZORPAY_KEY, RAZORPAY_SECRET } = process.env;

exports.payment = async (req, res) => {
    console.log("Request Body:", req.body);

    const razorpay = new Razorpay({
        key_id: RAZORPAY_KEY,
        key_secret: RAZORPAY_SECRET,
    });

    const options = {
        amount: req.body.totalPrice * 100, 
        currency: "INR",
        receipt: Date.now().toString(), 
        payment_capture: 1,
    };

    try {
        const response = await razorpay.orders.create(options);
        res.json({
            success: true,
            data: response,
            order_id: response.id,
            currency: response.currency,
            amount: response.amount,
        });
    } catch (err) {
        console.error("Error creating order:", err);
        res.status(400).json({
            message: 'Not able to create order. Please try again!',
            error: err.message,
        });
    }
};





exports.paymentCapture = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, product, firstName, lastName, address, apartment, city, state, country, pinCode, phoneNumber } = req.body;
    const userId = req.user.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !product || !userId) {
        return res.status(200).json({ success: false, message: "Payment Failed" });
    }

    const data = razorpay_order_id + '|' + razorpay_payment_id; // Correct format for signature
    const generatedSignature = crypto.createHmac('sha256', RAZORPAY_SECRET)
        .update(data)
        .digest('hex');

    if (generatedSignature === razorpay_signature) {
        await buyOrder({ product, firstName, lastName, address, apartment, city, state, country, pinCode, phoneNumber, userId }, res);
        res.json({ status: 'ok', success: true });
    } else {
        res.status(400).send('Invalid signature');
    }
};


const buyOrder = async ({ product, firstName, lastName, address, apartment, city, state, country, pinCode, phoneNumber, userId }, res) => {
    if (!product || !userId) {
        return res.status(400).json({
            success: false,
            message: "Order not found or missing user"
        });
    }

    for (const productId of product) {
        const newOrder = new Order({
            firstName,
            lastName,
            addresses: [{
                type: 'home', 
                address,
                city,
                apartment,
                country,
                pinCode,
                state,
            }],
            phoneNumber,
            products: {
                product: productId,
                quantity: 1
            },
            totalAmount: 1000,  
            user: userId, 
        });
        
        await newOrder.save();

        const user = await User.findById(userId);
        user.orderHistory.push(newOrder._id);
        await user.save();

        console.log("order created successfully")
    }
};