const express = require("express");
const { searchAll } = require("../controllers/Search");


const router = express.Router();


router.get("/searchall", searchAll);


module.exports = router;