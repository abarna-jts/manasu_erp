import express from 'express';
import{createFirstForm, getFirstForm,
    UpdateFirstForm, getRescueDetailsPDF,
    checkAdmissionNo,UpdateStatus,

}from "../controllers/admission.js";
const router = express.Router();

//checking Admission Number(first_information.jsx)
router.get("/check_admission_no/:admission_no",checkAdmissionNo); // completed

//First Information form creation(first_information.jsx)
router.post("/create_first_form", createFirstForm); // completed

//Get First Information form(Rescue_details.jsx)
router.get("/get_first_form", getFirstForm); // completed

//Updating First Information Form(Edit_RescueDetails.jsx)
router.put('/update_first_form/:id',UpdateFirstForm); //completed

//get rescue detail for PDF(Rescue_details.jsx)
router.get('/get_rescue_details/:id',getRescueDetailsPDF); // completed

//Resident Status Updation(Rescue_details.jsx)
router.put('/updateStatus/:id',UpdateStatus); //completed



export default router;
