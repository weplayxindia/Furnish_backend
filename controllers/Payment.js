const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/product');
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
    const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature, 
        product, 
        
        formData
    } = req.body;

    const userId = req.user.id;

    // Log all fields for debugging
    console.log("Payment Capture Request Body:", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        product,
        
        userId,
        formData
    });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !product || !userId) {
        return res.status(200).json({ success: false, message: "Payment Failed" });
    }

    const data = razorpay_order_id + '|' + razorpay_payment_id; 
    const generatedSignature = crypto.createHmac('sha256', RAZORPAY_SECRET)
        .update(data)
        .digest('hex');

    if (generatedSignature === razorpay_signature) {
        await buyOrder({ 
            product, 
            formData,
            userId 
        }, res);
        res.json({ status: 'ok', success: true });
    } else {
        res.status(400).send('Invalid signature');
    }
};



const buyOrder = async ({ product, formData, userId }, res) => {
    if (!product || !userId) {
        return res.status(400).json({
            success: false,
            message: "Order not found or missing user"
        });
    }

    for (const productId of product) {
        try {
            
            const productDetails = await Product.findById(productId);
            if (!productDetails) {
                return res.status(400).json({ success: false, message: "Product not found" });
            }

            
            const totalAmount = productDetails.price;

            // Create a new order
            const newOrder = new Order({
                firstName : formData.firstName,
                lastName :formData.lastName ,
                addresses: [{
                    type: 'home', 
                    address : formData.address,
                    city : formData.city,
                    apartment : formData.apartment,
                    country : formData.country,
                    pinCode : formData.pinCode,
                    state : formData.state,
                }],
                phoneNumber :formData.phoneNumber ,
                products: {
                    product: productId,
                    quantity: 1,
                },
                totalAmount,  
                user: userId, 
                paymentStatus : 'paid'
            });
            
            await newOrder.save();

            // Update user order history
            const user = await User.findById(userId);
            user.orderHistory.push(newOrder._id);
            await user.save();

            console.log("Order created successfully");

        } catch (error) {
            console.error("Error in buyOrder:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to create order",
            });
        }
    }
};
