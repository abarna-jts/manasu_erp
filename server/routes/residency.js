const express = require('express');
const { createRescueCondition, 
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
     createPrescription
    } = require("../controllers/residency");
const router = express.Router();

router.post("/rescue_condition", createRescueCondition);
router.get("/get_conidition_details",getConditionDetails);
router.delete("/delete_condition_details/:id",deleteConditionDetails);
router.get("/rescue_condition/:id",getEditData);
router.get("/rescueConditionShow/:id",showRescueCondition);
router.post("/updateRescueCondition/:admission_no",updateRescueCondition);

// Nurse Record 

router.post("/nurse_record",createRecord);
router.get("/get_nurse_record",getNurseRecord);
router.get("/getNurseRecordbyID/:id",getNurseRecordbyID);
router.put("/updateRecords/:id",updateNurseRecords);

//prescription 
router.post("/createPrescription",createPrescription);

// Doctor Consultancy 
router.post("/create_dr_consults",createDrConsultant);
router.get("/get_dr_consultant/:admissionNumber",getDrConsultant);
router.put("/update_dr_consultant/:admissionNumber",UpdateDrConsultant)

//social worker observation report
router.post("/create_observation_report", createObservationReport);
router.get("/get_observation_report",getObservationReport);
router.get("/show_data/:id",showObservationReport);
router.post("/updateObservationReport/:admission_no",updateObservationReport);

module.exports = router;
