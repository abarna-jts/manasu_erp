const express = require('express');
const { createFirstForm, getFirstForm, getForm2Data, DeleteFirstForm,UpdateFirstForm, getFirst2AForm, getRescueDetailsPDF,
    // getSCRBFormData,
    // getSCRB2AFormData,
    // getSCRB2BFormData,
    // getSCRB2CFormData,
    checkAdmissionNo,
    getAllSCRBFormData
} = require("../controllers/admission");
const router = express.Router();

router.get("/check_admission_no/:admission_no",checkAdmissionNo);

router.post("/create_first_form", createFirstForm);
router.get("/get_first_form", getFirstForm);
router.delete('/delete_first_form/:id',DeleteFirstForm);
router.put('/update_first_form/:id',UpdateFirstForm);

router.get('/get_scrb_formdata/:admission_no',getFirst2AForm);
router.get("/get_scrbform2data/:admission_no",getForm2Data);
router.get('/get_rescue_details/:id',getRescueDetailsPDF);

// router.get('/getSCRBFormData/:admissionNumber',getSCRBFormData);
// router.get('/getSCRB2AFormData/:admissionNumber',getSCRB2AFormData);
// router.get('/getSCRB2BFormData/:admissionNumber',getSCRB2BFormData);
// router.get('/getSCRB2CFormData/:admissionNumber',getSCRB2CFormData);

router.get("/getallSCRBFormData/:admission_no",getAllSCRBFormData);
module.exports = router;
