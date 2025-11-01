const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "server/upload/info/");
  },
  filename: (req, file, cb) => {
    const prefix = Date.now() + file.originalname;
    cb(null, prefix);
  },
});

const limits = {
  fileSize: 2000000,
};

const upload = multer({ storage: storage, limits: limits });

module.exports = upload;
