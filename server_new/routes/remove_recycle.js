import express from "express";
import {moveToRecycleBin, 
    getRecycleBin, 
    restoreRecycleBin, 
    MediaConsenttoRecycleBin, 
    SelfDeclarationRecycleCycle,
    FamReqFormtoRecycleBin,
    EssentialRectoRecycleBin,
    DischargeSummarytoRecycleBin,DischargeDetailstoRecycleBin,
    SCRBForm2toRecycleBin, SCRBForm2AtoRecycleBin, SCRBForm2BtoRecycleBin, SCRBForm2CtoRecycleBin,
    RescueDetailtoRecycleBin, ConsultationtoRecycleBin, DrVisittoRecycleBin, NurseRecordtoRecycleBin, 
    PrescriptiontoRecycleBin, InternShiptoRecycleBin, MedicalCamptoRecycleBin, EventReporttoRecycleBin,
    CelebrationtoRecycleBin, CommunityReporttoRecycleBin, StaffProgramtoRecycleBin,
    observationReportToRecBin
} from "../controllers/recycleController.js";

const router = express.Router();

router.delete("/movetoRecycleBin/:admission_no", moveToRecycleBin); //completed
router.get('/getRecycleBin', getRecycleBin);
router.post('/restoreRecycleBin/:id', restoreRecycleBin);

//rescue Detail
router.delete("/RescueDetailtoRecycleBin/:admission_no", RescueDetailtoRecycleBin);

//media consent
router.delete("/MediaConsenttoRecycleBin/:admission_no", MediaConsenttoRecycleBin);

//self declaration 
router.delete("/SelfDeclarationRecycleCycle/:admission_no", SelfDeclarationRecycleCycle);

//family request form 
router.delete("/FamReqFormtoRecycleBin/:admission_no", FamReqFormtoRecycleBin);

//essential record
router.delete("/EssentialRectoRecycleBin/:admission_no", EssentialRectoRecycleBin);

//reunion Summary
router.delete("/DischargeSummarytoRecycleBin/:admission_no", DischargeSummarytoRecycleBin);

//discharge details
router.delete("/DischargeDetailstoRecycleBin/:admission_no", DischargeDetailstoRecycleBin);

//scrb form 2
router.delete("/SCRBForm2toRecycleBin/:admission_no", SCRBForm2toRecycleBin);

//scrb form 2A
router.delete("/SCRBForm2AtoRecycleBin/:admission_no", SCRBForm2AtoRecycleBin);

//scrb form 2B
router.delete("/SCRBForm2BtoRecycleBin/:admission_no", SCRBForm2BtoRecycleBin);

//scrb form 2C
router.delete("/SCRBForm2CtoRecycleBin/:admission_no", SCRBForm2CtoRecycleBin);

//consulation report
router.delete("/ConsultationtoRecycleBin/:admission_no", ConsultationtoRecycleBin);

//dr_visit 
router.delete("/DrVisittoRecycleBin/:id", DrVisittoRecycleBin);

//nurse_record sheet
router.delete("/NurseRecordtoRecycleBin/:admission_no", NurseRecordtoRecycleBin);

//prescription
router.delete("/PrescriptiontoRecycleBin/:admission_no", PrescriptiontoRecycleBin);

//internship detail
router.delete("/InternShiptoRecycleBin/:id", InternShiptoRecycleBin);

//medical Camp
router.delete("/MedicalCamptoRecycleBin/:id", MedicalCamptoRecycleBin);

//event report
router.delete("/EventReporttoRecycleBin/:id", EventReporttoRecycleBin);

//celebration report
router.delete("/CelebrationtoRecycleBin/:id", CelebrationtoRecycleBin);

//community report
router.delete("/CommunityReporttoRecycleBin/:id", CommunityReporttoRecycleBin)

//staff programs report
router.delete("/StaffProgramtoRecycleBin/:id", StaffProgramtoRecycleBin);



export default router;