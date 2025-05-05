const express = require('express');
const { createFirstForm, getFirstForm, DeleteFirstForm,UpdateFirstForm, getSCRBFormDatta } = require("../controllers/admission");
const router = express.Router();

router.post("/create_first_form", createFirstForm);
router.get("/get_first_form", getFirstForm);
router.delete('/delete_first_form/:id',DeleteFirstForm);
router.put('/update_first_form/:id',UpdateFirstForm);
router.get('/get_scrb_formdata/:admissionNumber', getSCRBFormDatta);

module.exports = router;
