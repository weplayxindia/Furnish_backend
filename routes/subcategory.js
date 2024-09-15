const express =require("express");
const { auth, isAdmin } = require("../middleware/auth");
const { createSubcategory, getAllSubcategories, getSubcategoryById, deleteSubcategory, getTopSubcategories } = require("../controllers/SubCategory");
const router = express.Router();

router.post("/createsubcategory", auth, isAdmin, createSubcategory );
router.get("/getallsubcategory", getAllSubcategories);
router.get(`/getsubcategorybyid/:id`, getSubcategoryById);
router.delete(`/deletesubcategorybyid/:id`,auth, isAdmin, deleteSubcategory);
router.get("/gettopsubcategory", getTopSubcategories);


module.exports = router