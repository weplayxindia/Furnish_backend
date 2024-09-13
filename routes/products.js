const express = require("express");
const { auth, isAdmin } = require("../middleware/auth");
const { createProduct, getAllProducts, getProductById, deleteProduct } = require("../controllers/Products");

const router = express.Router();

router.post("/createproduct", auth, isAdmin, createProduct);
router.get("/getallproduct", getAllProducts);
router.get(`/getproductbyid/:id`, getProductById);
router.delete(`/deletebyid/:id`,auth, isAdmin, deleteProduct);

module.exports = router;