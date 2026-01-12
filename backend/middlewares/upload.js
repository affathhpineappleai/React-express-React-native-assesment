// backend/middlewares/upload.js
const multer = require("multer");
const path = require("path");

// Setup storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); //save files in uploads folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);//unique suffix for file name
    cb(null, uniqueSuffix + path.extname(file.originalname)); //unique file name
  }
});

// File filter to accept images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Export multer instance
module.exports = require("multer")({ storage, fileFilter });
