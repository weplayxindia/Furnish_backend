const express = require("express");
const { payment, paymentCapture } = require("../controllers/Payment");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/order", auth, payment );
router.post("/verifypayment", auth, paymentCapture);
module.exports = router;