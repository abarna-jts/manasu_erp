import express from 'express';
import { createRescueCondition, 
    getConditionDetails, 
    deleteConditionDetails,
    getEditData,
     createRecord, 
     createDrConsultant,
     getDrConsultant, 
     UpdateDrConsultant,
     getNurseRecord,
     updateNurseRecords,
     createObservationReport,
     getObservationReport,
     showObservationReport,
     updateObservationReport,
     showRescueCondition,
     updateRescueCondition,
     getNurseRecordbyID,
     createPrescription,
     getPrescriptionALL,
     getPrescriptionbyID,
     updatePrescription,
     createDrVisit,
     getAllDrVisit,getDrVisitbyID,UpdateDrVisit,
     createMedicalCamp,getMedicalCamp, getMedicalCampID, updateMedicalCamp,
     createSummary,getSummary, updateSummary
    } from '../controllers/residency.js';
const router = express.Router();

router.post("/rescue_condition", createRescueCondition); //completed
router.get("/get_conidition_details",getConditionDetails); //completed
// router.delete("/delete_condition_details/:id",deleteConditionDetails);
router.get("/rescue_condition/:id",getEditData); //completed
router.get("/rescueConditionShow/:id",showRescueCondition); //completed
router.post("/updateRescueCondition/:admission_no",updateRescueCondition); //completed

// Nurse Record 

router.post("/nurse_record",createRecord); //completed
router.get("/get_nurse_record",getNurseRecord); //completed
router.get("/getNurseRecordbyID/:id",getNurseRecordbyID); //completed
router.put("/updateRecords/:id",updateNurseRecords); //completed

//prescription 
router.post("/createPrescription",createPrescription); //completed
router.get('/getPrescriptionALL',getPrescriptionALL); //completed
router.get("/getPrescription/:id",getPrescriptionbyID); //completed
router.put("/updatePrescription/:id",updatePrescription);

// Doctor Consultancy 
router.post("/create_dr_consults",createDrConsultant); //completed
router.get("/get_dr_consultant/:admissionNumber",getDrConsultant); //completed
router.put("/update_dr_consultant/:admissionNumber",UpdateDrConsultant) //completed

//social worker observation report
router.post("/create_observation_report", createObservationReport); //completed
router.get("/get_observation_report",getObservationReport); //completed
router.get("/show_data/:id",showObservationReport); //completed
router.post("/updateObservationReport/:admission_no",updateObservationReport); //completed

//dr_visit
router.post("/createDrVisit", createDrVisit); //completed
router.get("/getDrVisit",getAllDrVisit); //complete
router.get("/getDrVisitbyID/:id",getDrVisitbyID); //completed
router.put("/updateDrVisit/:id",UpdateDrVisit); //completed

//Medical Camp
router.post("/createMedicalCamp",createMedicalCamp); //completed
router.get("/getAllMedicalCamp",getMedicalCamp); //completed
router.get("/getMedicalCampID/:id",getMedicalCampID); //completed
router.put("/updateMedicalCamp/:id",updateMedicalCamp); //completed

//Reunion summary
router.post("/createSummary", createSummary); //completed
router.get("/getSummary/:admission_no",getSummary); //completed
router.put("/updateSummary/:admission_no", updateSummary);//completed

export default router;
