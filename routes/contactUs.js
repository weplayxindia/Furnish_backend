const express = require('express');
const { login, signUp } = require('../controllers/Auth');
const { contactUs } = require('../controllers/Contact');

const router = express.Router();

router.post("/contact-us", contactUs);

module.exports = router;