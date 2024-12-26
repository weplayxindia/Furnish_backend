const express = require("express");
const { auth, isAdmin } = require("../middleware/auth");
const { createProduct, getAllProducts, getProductById, deleteProduct, deleteProductByDate } = require("../controllers/Products");
const upload = require("../middleware/multerConfig");

const router = express.Router();

router.post("/createproduct",upload.array('images'), auth, isAdmin, createProduct);
router.get("/getallproduct", getAllProducts);
router.get(`/getproductbyid/:id`, getProductById);
router.delete(`/deletebyid/:id`,auth, isAdmin, deleteProduct);
router.delete(`/deletebydate`,auth, isAdmin, deleteProductByDate);
router.put(`/setthumbnail`,auth, isAdmin, setThumbnail);

module.exports = router;
