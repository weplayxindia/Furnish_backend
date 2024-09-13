const express = require("express");
const { createCategory, getAllCategory, getCategoryById, deleteCategoryById } = require("../controllers/Category");
const { isAdmin, auth } = require("../middleware/auth");
const router = express.Router();

router.post("/create-category", auth, isAdmin, createCategory);
router.get("/getallcategory", getAllCategory);
router.get("/getcategorybyid/:id", getCategoryById);
router.delete("/deletecategorybyid/:id", deleteCategoryById)

module.exports = router;