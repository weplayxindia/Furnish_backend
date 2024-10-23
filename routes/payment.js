const express = require("express");
const { payment, paymentCapture, paymentByCashFree, verifyPaymentByCashFree } = require("../controllers/Payment");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/order",  payment );
router.post("/verifypayment",  paymentCapture);
router.post("/cashfree-order",paymentByCashFree );
router.post("/cashfree-verify/:orderId", verifyPaymentByCashFree);
module.exports = router;