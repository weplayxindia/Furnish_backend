const express = require("express");
const { payment, paymentCapture } = require("../controllers/Payment");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/order",  payment );
router.post("/verifypayment",  paymentCapture);
module.exports = router;