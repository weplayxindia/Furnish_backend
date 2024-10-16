const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/product');
const { RAZORPAY_KEY, RAZORPAY_SECRET } = process.env;
const bcrypt = require("bcrypt");
const createPDF = require('../utils/htmlToPdf');
const mailSender = require('../utils/mailSender');
const orderSuccessTemplate = require('../mail/template/orderSuccessful');

const fs = require('fs');

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

    const reqBody = req.body

    console.log("success payment response ", req.body)

    // const userId = req.user.id;

    // Log all fields for debugging
    console.log("Payment Capture Request Body:", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        product,
        
        // userId,
        formData
    });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !product ) {
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
            reqBody
            // userId 
        }, res);
        res.json({ status: 'ok', success: true });
    } else {
        res.status(400).send('Invalid signature');
    }
};



const buyOrder = async ({ product, formData, reqBody }, res) => {
    if (!product || !formData.email) {
        return res.status(400).json({
            success: false,
            message: "Order not found or missing email"
        });
    }

    try {
        let user = await User.findOne({ email: formData.email });
        
        if (!user) {
            const hashedPassword = await bcrypt.hash("12345678", 10); 
            user = await User.create({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: hashedPassword,
            });
            console.log("User created successfully with email:", formData.email);
        }

        for (const productId of product) {
            const productDetails = await Product.findById(productId);
            if (!productDetails) {
                return res.status(400).json({ success: false, message: "Product not found" });
            }

            const totalAmount = productDetails.price;

            const newOrder = new Order({
                firstName: formData.firstName,
                lastName: formData.lastName,
                addresses: [{
                    type: 'home',
                    address: formData.address,
                    city: formData.city,
                    apartment: formData.apartment,
                    country: formData.country,
                    pinCode: formData.pinCode,
                    state: formData.state,
                }],
                phoneNumber: formData.phoneNumber,
                products: {
                    product: productId,
                    quantity: 1,
                },
                totalAmount,
                user: user._id, 
                paymentStatus: 'paid',
                selectedWood: formData.selectedWood,
                email: formData.email
            });

            await newOrder.save();
            console.log("order details ", newOrder);

            user.orderHistory.push(newOrder._id);
            await user.save();

            
            const invoice = await createPDF(reqBody, newOrder, productDetails.name);
            await mailSender(formData.email, "Order Confirmed", orderSuccessTemplate(formData.firstName, newOrder._id, formData.email, newOrder.totalAmount), newOrder._id, invoice);
            fs.unlink(invoice, (err) => {
                if (err) {
                    console.error("Error deleting invoice:", err);
                } else {
                    console.log("Invoice deleted successfully:", invoice);
                }
            });
            console.log("Order created successfully");
        }

    } catch (error) {
        console.error("Error in buyOrder:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create order",
            error: error.message
        });
    }
};
