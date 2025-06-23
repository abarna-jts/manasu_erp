import util from "util";
import path from "path";
import multer from "multer";
import fs from "fs"; 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("uploads/Articles_carried/"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});


const upload = multer({ storage: storage }).single("attach_items");

const recoveryAsync = util.promisify(upload);

export{upload,recoveryAsync};