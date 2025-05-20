const express = require('express');
const { createSelfDeclaration,
    getFormalityForm,
    updateFormalityForm,
    deleteFormalityForm,
    createRecords,
    getEssentialRecords,
    updateEssentialRecords,
    deleteEssentialRecord,
    createAnnualReport,
    getAnnualReport,
    getAnnualReportbyID,
    updateAnnualReport,
    deleteAnnualReport,
    getRescueDetails,
    createRescueDischargeInfo,
    getDischargeSummary,
    getDischargeSummaryID,
    updateDischargeSummary,
    deleteDischargeSummary,
    createInternForm,
    getStudentDetails,
    getStudendDetailsbyID,
    updateStudentDetail
} = require("../controllers/formality");
const router = express.Router();

router.post("/createDeclaration", createSelfDeclaration);
router.get("/getFormalityForm/:admission_no",getFormalityForm);
router.put("/updateFormalityForm/:admission_no",updateFormalityForm);
router.delete("/deleteFormalityForm/:admission_no",deleteFormalityForm);

//Essential Record
router.post("/createRecords",createRecords);
router.get("/getEssentialRecord/:admission_no",getEssentialRecords);
router.put("/updateEssentialRecords/:admission_no",updateEssentialRecords);
router.delete("/deleteEssentailRecord/:admission_no",deleteEssentialRecord);

//annual Report
router.post("/createAnnualReport", createAnnualReport);
router.get("/getReport", getAnnualReport);
router.get("/getAnnualReport/:id", getAnnualReportbyID);
router.put("/updateAnnualReport/:id",updateAnnualReport);
router.delete("/deleteAnnualReport/:id",deleteAnnualReport);

//rescue_details
router.get("/getRescueDetails/:admission_no",getRescueDetails);
router.post("/create_dischargeInfo",createRescueDischargeInfo);
router.get("/getDischargeSummary",getDischargeSummary);
router.get("/getDischargeSummaryID/:id",getDischargeSummaryID);
router.put("/updateDischargeSummary/:id",updateDischargeSummary);
router.delete("/deleteDischargeSummary/:id",deleteDischargeSummary);

//internship form 
router.post("/createInternForm", createInternForm);
router.get("/getStudentDetails",getStudentDetails);
router.get("/getStudentDet/:id",getStudendDetailsbyID);
router.put("/updateStudentDetail/:id",updateStudentDetail);

module.exports = router;
