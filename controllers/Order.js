const Order = require("../models/order");



exports.createOrder = async (req, res) => {
    try {
        const { user, products, totalAmount, addresses } = req.body;

        if (!user || !products || !totalAmount || !addresses) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        const newOrder = await Order.create({
            user,
            products,
            totalAmount,
            addresses
        });

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: newOrder
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create order', 
            error: error.message 
        });
    }
};


exports.getOrdersByUser = async (req, res) => {
    try {
        const userId = req.user.id;
        if(!userId) {
            return res.status(400).json({
                message:"user id not found",
                success:false
            })
        }
        const orders = await Order.find({ user: userId }).populate('products.product').populate('user').populate('addresses');

        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch orders', 
            error: error.message 
        });
    }
};


exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const orderId = req.params.orderId;

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order: updatedOrder
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order status',
            error: error.message
        });
    }
};


exports.deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete order',
            error: error.message
        });
    }
};
