const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || "dsuxginpx",
  api_key: process.env.CLOUDINARY_KEY || "637635166346826",
  api_secret: process.env.CLOUDINARY_SECRET || "StXF3PJO-E5MmEfeYd6lIr6rayU",
});
// tạo storage
const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png"],
  params: {
    folder: "user",
  },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
