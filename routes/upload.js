const express = require('express');
const upload = require('../middleware/multerConfig'); 
const { uploader } = require('../controllers/Uploader');

const router = express.Router();

// File upload route
router.post('/upload', upload.single('file'), uploader);

module.exports = router;
