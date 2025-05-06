const express = require('express');
const { createForm2 ,createForm2A,createForm2B, createForm2C,getForm2APDF,getForm2BPDF, getForm2CPDF, getForm2PDF} = require("../controllers/scrb_form");
const router = express.Router();

router.post("/create_form2", createForm2);
router.post("/create_form_2A", createForm2A);
router.post("/create_form_2B",createForm2B);
router.post("/create_form_2C",createForm2C);

//pdf file get
router.get('/get_scrb_form2/:admissionNumber', getForm2PDF);
router.get('/get_scrb_form2adata/:admissionNumber', getForm2APDF);
router.get('/get_scrb_form2bdata/:admissionNumber', getForm2BPDF);
router.get('/get_scrb_form2cdata/:admissionNumber', getForm2CPDF);

module.exports = router;
