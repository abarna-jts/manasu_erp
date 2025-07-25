import util from "util";
import path from "path";
import multer from "multer";
import fs from "fs"; 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'bank_passbook' || file.fieldname === 'form7_attach') {
            cb(null, path.resolve('uploads/Rescue_Images/'));
        }
        else if (file.fieldname === 'stud_photo') {
            cb(null, path.resolve('uploads/Internship_photos/'));
        }
        else {
            cb(null, path.resolve('uploads/Event_Photos/'));
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

// const upload = multer({ storage: storage }).single("bank_passbook");

const upload = multer({ storage: storage }).fields([
    { name: 'bank_passbook', maxCount: 20 },
    { name: 'form7_attach', maxCount: 20 },
    { name: 'attach_aadhar', maxCount: 20 },
    { name: 'udid_attach', maxCount: 20 },
    { name: 'event_photos', maxCount: 20 },
    { name: 'celebration_photos', maxCount: 20},
    { name: 'programms_photos', maxCount: 20},
    { name: 'staff_photos', maxCount: 20},
    { name: 'awarness_photos', maxCount: 20 },
    { name: 'outing_photos', maxCount: 20 },
    { name: 'stud_photo', maxCount: 10 }
]);

const formalityAsync = util.promisify(upload);

export{upload,formalityAsync};