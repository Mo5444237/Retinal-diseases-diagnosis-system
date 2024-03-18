const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const multerOpts = (destination) => {
  // Handle file name and destination
  fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() + "." + file.mimetype.split("/")[1]);
    },
  });

  // Determine allowed images types
  fileFilter = (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  return multer({ storage: fileStorage, fileFilter: fileFilter });
};

// upload only one image
exports.uploadSingleImage = (destination, fieldName) =>
  multerOpts(destination).single(fieldName);

// upload multible images
exports.uploadMultibleImages = (destination, fieldName) =>
  multerOpts(destination).array(fieldName);
