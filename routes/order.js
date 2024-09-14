const express = require('express');
const { createOrder, getOrdersByUser, updateOrderStatus, deleteOrder } = require('../controllers/Order');

const router = express.Router();


router.post('/orders', createOrder);


router.get('/orders/user/:userId', getOrdersByUser);


router.patch('/orders/:orderId/status', updateOrderStatus);


router.delete('/orders/:orderId', deleteOrder);

module.exports = router;
