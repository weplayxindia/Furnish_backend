const express = require("express");
const { searchAll } = require("../controllers/Search");


const router = express.Router();


router.get("/searchAll", searchAll);


module.exports = router;