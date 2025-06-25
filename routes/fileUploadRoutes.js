const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMiddleware");
const {
  handleFileUpload,
  getUploadedFile,
  deleteUploadedFile,
} = require("../controllers/fileUploadController");

router.post("/upload", auth, upload.single("file"), handleFileUpload);
router.get("/get-file", auth, getUploadedFile);
router.delete("/delete-file/:actualId", auth, deleteUploadedFile);

module.exports = router;
