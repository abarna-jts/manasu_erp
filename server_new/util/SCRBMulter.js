import util from 'util';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/form_2a/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Accept two files
const upload = multer({ storage: storage }).fields([
  { name: 'old_photo', maxCount: 15 },
  { name: 'new_photo', maxCount: 15 },
  { name: 'signature', maxCount: 15 },
  { name: 'seal', maxCount: 15 }
]);

const SCRBAsync = util.promisify(upload);

export{upload, SCRBAsync};