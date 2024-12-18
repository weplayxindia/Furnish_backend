const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/product');
const { RAZORPAY_KEY, RAZORPAY_SECRET, CASHFREE_CLIENT_ID, CASHFREE_CLIENT_SECRET } = process.env;
const bcrypt = require("bcrypt");
const createPDF = require('../utils/htmlToPdf');
const mailSender = require('../utils/mailSender');
const orderSuccessTemplate = require('../mail/template/orderSuccessful');

const {
    Cashfree
} = require('cashfree-pg');


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


Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

// Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;

function generateOrderId() {
    const uniqueId = crypto.randomBytes(16).toString('hex');

    const hash = crypto.createHash('sha256');
    hash.update(uniqueId);

    const orderId = hash.digest('hex');

    return orderId.substr(0, 12);
}


exports.paymentByCashFree = async (req, res) => {
    console.log("Req body from payment start: ", req.body);
    
    try {
        
        const { firstName, lastName, phoneNumber,email, customer_email, totalPrice } = req.body;
        console.log("Total Price : ", totalPrice)

        
        let request = {
            "order_amount": totalPrice, 
            "order_currency": "INR",
            "order_id": await generateOrderId(), 
            "customer_details": {
                "customer_id": "customer_id",        
                "customer_phone": phoneNumber,  
                "customer_name": ` ${firstName} ${lastName} `,    
                "customer_email": email,  
            },
        };

        
        Cashfree.PGCreateOrder("2023-08-01", request)
            .then(response => {
                console.log(response.data);
                res.json(response.data); 
            })
            .catch(error => {
                console.error(error.response.data.message);
                res.status(500).json({ error: error.response.data.message });
            });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while processing the payment" });
    }
};

exports.verifyPaymentByCashFree = async(req, res) => {
    console.log("Req body from payment verify  : ", req.body)
    const { product, totalPrice, formData } = req.body;
    const reqBody = req.body;

    try {
        let { orderId } = req.params;

        Cashfree.PGOrderFetchPayments("2023-08-01", orderId).then(async(response) => {
            const paymentData = response.data[0];  // Accessing the first item in the array

            console.log("Payment Response: ", paymentData);

            if(paymentData.payment_status === "SUCCESS") {
                console.log("Payment successful, proceeding to place the order...");
                
                // Call buyOrder only if the payment is successful
                await buyOrder({
                    product,
                    formData,
                    reqBody
                }, res);
            } else {
                console.log("Payment status not successful:", paymentData.payment_status);
                res.status(400).json({
                    success: false,
                    message: `Payment failed with status: ${paymentData.payment_status}`
                });
            }

            return res.status(200).json({
                message:"Payment successful",
                success:true,
                paymentData
            })
        }).catch(error => {
            console.error("Error during payment verification: ", error.response.data.message);
            res.status(500).json({
                success: false,
                message: "Error verifying payment",
                error: error.response.data.message
            });
        });
    } catch (error) {
        console.error("Error in verifying payment: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
