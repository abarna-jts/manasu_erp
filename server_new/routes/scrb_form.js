import express from 'express';
import{createForm2 ,createForm2A,createForm2B, createForm2C,getForm2APDF,getForm2BPDF, getForm2CPDF, getForm2PDF, getForm2Data, getAllSCRBFormData} from "../controllers/scrb_form.js";

const router = express.Router();

//create SCRB Form
router.post("/create_form2", createForm2); //(SCRB_Form.jsx)  //completed
router.post("/create_form_2A", createForm2A); //(SCRB_Form2A.jsx)  //completed
router.post("/create_form_2B",createForm2B); //(SCRB_Form2B.jsx)  //completed
router.post("/create_form_2C",createForm2C); //(SCRB_Form2C.jsx)  //completed

//pdf file get from SCRB FORM
router.get('/get_scrb_form2/:admission_no', getForm2PDF); //(SCRB_Form.jsx) //completed
router.get('/get_scrb_form2adata/:admission_no', getForm2APDF); //(SCRB_Form2A.jsx) //completed
router.get('/get_scrb_form2bdata/:admission_no', getForm2BPDF); //(SCRB_Form2B.jsx) //completed
router.get('/get_scrb_form2cdata/:admission_no', getForm2CPDF); //(SCRB_Form2C.jsx) //completed

//get scrb form2 details(SCRB_form.jsx, SCRB_form2A.jsx, SCRB_form2B.jsx, SCRB_form2C.jsx)
router.get("/get_scrbform2data/:admission_no",getForm2Data); //completed

//Excel formate of all scrbform data getting(SCRB_form2C.jsx)
router.get("/getallSCRBFormData/:admission_no",getAllSCRBFormData); // completed

export default router;
