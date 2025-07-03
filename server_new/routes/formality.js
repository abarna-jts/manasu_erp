import express from "express";
import {
createSelfDeclaration,
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
    updateStudentDetail,
    createEventReport,
    createCelebrationReport,
    createCommunityReport,
    createStaffReport,getAllDocument,getEssentialRecordshow,
    getEventReport, getEventReportbyID, getCelebrationReport, 
    getCelebrationbyID, getProgramsReport, getProgramsbyID, getStaffProgramsReport, getStaffProgramsbyID,
    updateEventDetail, updateCelebrationDetail, updateProgrambyID, updateStaffProgrambyID
}from "../controllers/formality.js";

const router = express.Router();

router.post("/createDeclaration", createSelfDeclaration); //completed
router.get("/getFormalityForm/:admission_no",getFormalityForm); //completed
router.put("/updateFormalityForm/:admission_no",updateFormalityForm); //completed
// router.delete("/deleteFormalityForm/:admission_no",deleteFormalityForm);

//Essential Record
router.post("/createEventReport",createEventReport); //completed
router.post("/createCelebrationReport",createCelebrationReport); //completed
router.post("/createCommunityReport", createCommunityReport); //completed
router.post("/createStaffReport", createStaffReport); //completed
router.post("/createRecords",createRecords); //completed
router.get("/getEssentialRecord/:admission_no",getEssentialRecords); //completed
router.get("/getEssentialRecordshow/:id",getEssentialRecordshow); //completed
router.put("/updateEssentialRecords/:admission_no",updateEssentialRecords); //completed
// router.delete("/deleteEssentailRecord/:admission_no",deleteEssentialRecord);

//annual Report
router.post("/createAnnualReport", createAnnualReport); //completed
router.get("/getReport", getAnnualReport); // not used
router.get("/getAnnualReport/:id", getAnnualReportbyID); //completed
router.put("/updateAnnualReport/:id",updateAnnualReport); //completed
// router.delete("/deleteAnnualReport/:id",deleteAnnualReport);

//rescue_details
router.get("/getRescueDetails/:admission_no",getRescueDetails); //completed
router.post("/create_dischargeInfo",createRescueDischargeInfo); //completed
router.get("/getDischargeSummary",getDischargeSummary); //completed
router.get("/getDischargeSummaryID/:id",getDischargeSummaryID); //completed
router.put("/updateDischargeSummary/:id",updateDischargeSummary); //completed
// router.delete("/deleteDischargeSummary/:id",deleteDischargeSummary);

//internship form 
router.post("/createInternForm", createInternForm); //completed
router.get("/getStudentDetails",getStudentDetails); //completed
router.get("/getStudentDet/:id",getStudendDetailsbyID); //completed
router.put("/updateStudentDetail/:id",updateStudentDetail); //completed

//director routes
router.get("/getAllDocument",getAllDocument); //completed

//Annual Report routes for getting pdf
router.get("/getEventReport", getEventReport);
router.get("/getEventReportbyID/:id", getEventReportbyID);
router.get("/getCelebrationReport", getCelebrationReport);
router.get("/getCelebrationbyID/:id", getCelebrationbyID);
router.get("/getProgramsReport", getProgramsReport);
router.get("/getProgramsbyID/:id", getProgramsbyID);
router.get("/getStaffProgramsReport",getStaffProgramsReport);
router.get("/getStaffProgramsbyID/:id", getStaffProgramsbyID);

router.put("/updateEventDetail/:id", updateEventDetail);
router.put("/updateCelebrationDetail/:id", updateCelebrationDetail);
router.put("/updateProgrambyID/:id", updateProgrambyID);
router.put("/updateStaffProgrambyID/:id", updateStaffProgrambyID);


export default router;
