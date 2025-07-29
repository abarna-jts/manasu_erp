import express from 'express';
import{createForm2 ,createForm2A,createForm2B, createForm2C,getForm2APDF,getForm2BPDF, getForm2CPDF, getForm2PDF, getForm2Data, getAllSCRBFormData,
    getAllSCRBForm2, getAllSCRBForm2A, getAllSCRBForm2B, getAllSCRBForm2C, getSCRB_form2, getSCRB_form2A, getSCRB_form2B, getSCRB_form2C, 
    updateForm2, updateForm2A, updateForm2B, updateForm2C
} from "../controllers/scrb_form.js";

const router = express.Router();

//create SCRB Form
router.post("/create_form2", createForm2); //(SCRB_Form.jsx)  //completed
router.post("/create_form_2A", createForm2A); //(SCRB_Form2A.jsx)  //completed
router.post("/create_form_2B",createForm2B); //(SCRB_Form2B.jsx)  //completed
router.post("/create_form_2C",createForm2C); //(SCRB_Form2C.jsx)  //completed

// all scrb form data
router.get("/getAllSCRBForm2", getAllSCRBForm2);
router.get("/getAllSCRBForm2A",getAllSCRBForm2A);
router.get("/getAllSCRBForm2B",getAllSCRBForm2B);
router.get("/getAllSCRBForm2C",getAllSCRBForm2C);
router.get("/getSCRB_form2/:id",getSCRB_form2);
router.get("/getSCRB_form2A/:id",getSCRB_form2A);
router.get("/getSCRB_form2B/:id",getSCRB_form2B);
router.get("/getSCRB_form2C/:id",getSCRB_form2C);
//pdf file get from SCRB FORM
router.get('/get_scrb_form2/:admission_no', getForm2PDF); //(SCRB_Form.jsx) //completed
router.get('/get_scrb_form2adata/:admission_no', getForm2APDF); //(SCRB_Form2A.jsx) //completed
router.get('/get_scrb_form2bdata/:admission_no', getForm2BPDF); //(SCRB_Form2B.jsx) //completed
router.get('/get_scrb_form2cdata/:admission_no', getForm2CPDF); //(SCRB_Form2C.jsx) //completed


//get scrb form2 details(SCRB_form.jsx, SCRB_form2A.jsx, SCRB_form2B.jsx, SCRB_form2C.jsx)
router.get("/get_scrbform2data/:admission_no",getForm2Data); //completed

//Excel formate of all scrbform data getting(SCRB_form2C.jsx)
router.get("/getallSCRBFormData/:admission_no",getAllSCRBFormData); // completed

router.put("/updateForm2/:id", updateForm2);
router.put("/updateForm2A/:id", updateForm2A);
router.put("/updateForm2B/:id", updateForm2B);
router.put("/updateForm2C/:id", updateForm2C);

export default router;
