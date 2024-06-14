const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadMiddleware = (destination) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: destination,
      allowedFormats: ["jpeg", "png", "jpg"],
    },
  });

  return multer({ storage });
};

// upload only one image
exports.uploadSingleImage = (destination, fieldName) =>
  uploadMiddleware(destination).single(fieldName);

// upload multible images
exports.uploadMultibleImages = (destination, fieldName) =>
  uploadMiddleware(destination).array(fieldName);
