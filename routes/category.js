const express = require("express");
const { createCategory } = require("../controllers/Category");
const { isAdmin, auth } = require("../middleware/auth");
const router = express.Router();

router.post("/create-category", auth, isAdmin, createCategory);

module.exports = router;