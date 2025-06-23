import path from 'path';
import multer from 'multer';
import fs from 'fs';
import util from 'util';

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.resolve("uploads/Resque_Condition_Images/"));
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;

    // Map field names to folders
    if (['summary_attach'].includes(file.fieldname)) {
      uploadPath = path.resolve('uploads/SummaryAttach/');
    } else {
      uploadPath = path.resolve('uploads/Resque_Condition_Images/');
    }

    // Create the folder if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });

    // Pass the folder to multer
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});


// const upload = multer({ storage: storage }).single("recovery_photo");
const upload = multer({ storage: storage }).fields([
  { name: 'recovery_photo', maxCount: 1 },
  { name: 'rescue_recovery_photo', maxCount: 1 },
  { name: 'summary_attach', maxCount: 1 },
]);

const residencyAsync = util.promisify(upload);

export{upload,residencyAsync};
