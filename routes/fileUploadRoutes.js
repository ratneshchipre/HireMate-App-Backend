const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMiddleware");
const handleFileUpload = require("../controllers/fileUploadController");

router.post("/upload", auth, upload.single("file"), handleFileUpload);

module.exports = router;
