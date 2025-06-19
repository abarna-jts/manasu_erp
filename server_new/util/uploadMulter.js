const util = require('util');
const multer = require('multer');
const path = require('path');
const db = require('../db');
const fs = require('fs');

// Storage strategy based on fieldname
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'rescue_image') {
      cb(null, path.resolve('uploads/Rescue_Images/'));
    } else {
      cb(null, path.resolve('uploads/Rescue_Document/'));
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Multer instance (callback-style)
const upload = multer({ storage: storage }).fields([
  { name: 'rescue_image', maxCount: 1 },
  { name: 'attach_policeMemo', maxCount: 1 },
  { name: 'govIdFile', maxCount: 1 },
]);

// ✅ Now promisify AFTER upload is declared
const uploadAsync = util.promisify(upload);

module.exports = { upload, uploadAsync };
